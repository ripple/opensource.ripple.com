import * as React from 'react';

interface AmendmentTrackerProps {
  amendmentId: string;
  xlsSpecDate?: string;
  onDataUpdate?: (data: AmendmentData) => void;
  onKeyDatesUpdate?: (keyDates: any[]) => void;
}

interface AmendmentData {
  devnetData: any;
  mainnetData: any;
  featureData: any;
  versionData: any;
  loading: boolean;
  apiErrors?: {
    devnet: boolean;
    mainnet: boolean;
    githubFeature: boolean;
    githubVersion: boolean;
  };
}

export const AmendmentTracker: React.FC<AmendmentTrackerProps> = ({ 
  amendmentId, 
  xlsSpecDate, 
  onDataUpdate, 
  onKeyDatesUpdate 
}) => {
  const [amendmentData, setAmendmentData] = React.useState<AmendmentData>({
    devnetData: null,
    mainnetData: null,
    featureData: null,
    versionData: null,
    loading: true,
    apiErrors: {
      devnet: false,
      mainnet: false,
      githubFeature: false,
      githubVersion: false
    }
  });

  // Helper function to format dates from UTC to local date
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    
    // Use browser locale for date formatting
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function to get date the feature is available to test on devnet
  const getDevnetDate = (featureData: any, apiErrors: any) => {
    // Check for errors in data sources needed for this date
    if (apiErrors?.devnet) return "API Error";  // Need VHS devnet data for amendment name
    if (apiErrors?.githubFeature) return "API Error";  // Need GitHub feature commits
    
    return featureData?.commit?.committer?.date ? 
      formatDate(featureData.commit.committer.date) : "TBA";
  };

  // Helper function to get date the feature is available for voting on Mainnet
  const getMainnetDate = (versionData: any, mainnetData: any, apiErrors: any) => {
    // Check for errors in data sources needed for this date
    if (apiErrors?.mainnet) return "API Error";  // Need mainnet data for amendment name and rippled version
    if (apiErrors?.githubVersion) return "API Error";  // Need GitHub build info commits
    
    if (!versionData?.commit?.committer?.date) return "TBA";
    
    const dateStr = formatDate(versionData.commit.committer.date);
    const version = mainnetData?.rippled_version ? ` (${mainnetData.rippled_version})` : '';
    return `${dateStr}${version}`;
  };

  // Helper function to get current voting status on Mainnet
  const getVotingStatus = (mainnetData: any, apiErrors: any) => {
    // Check for errors in data sources needed for this status
    if (apiErrors?.mainnet) return "API Error";  // Need mainnet data for voting status
    
    if (mainnetData?.consensus) {
      return mainnetData.consensus;
    }
    
    if (mainnetData?.date) {
      return `Enabled ${formatDate(mainnetData.date)}`;
    }
    
    return "TBA";
  };

  const generateKeyDates = (data: AmendmentData) => {
    return [
      { 
        date: xlsSpecDate ? formatDate(xlsSpecDate) : "TBA", 
        event: "XLS Spec Live" 
      },
      { 
        date: getDevnetDate(data.featureData, data.apiErrors), 
        event: "Available to Test on Devnet" 
      },
      { 
        date: getMainnetDate(data.versionData, data.mainnetData, data.apiErrors), 
        event: "Open for Voting on Mainnet" 
      },
      { 
        date: getVotingStatus(data.mainnetData, data.apiErrors), 
        event: "Vote Consensus" 
      },
    ];
  };

  React.useEffect(() => {
    const fetchAmendmentData = async () => {
      setAmendmentData(prev => ({ ...prev, loading: true }));

      // Initialize data containers
      let devnetAmendment: any = null;
      let mainnetAmendment: any = null;
      let implementationCommit: any = null;
      let versionCommit: any = null;
      let devnetApiError = false;
      let mainnetApiError = false;
      let githubFeatureError = false;
      let githubVersionError = false;

      // Fetch VHS devnet data
      try {
        const devnetResponse = await fetch(`https://vhs.prod.ripplex.io/v1/network/amendments/vote/dev`);
        
        if (!devnetResponse.ok) {
          throw new Error();
        }

        const devnetData = await devnetResponse.json();
        devnetAmendment = devnetData.amendments?.find(
          (amendment: any) => amendment.id === amendmentId
        );
      } catch (error) {
        devnetApiError = true;
      }

      // Fetch VHS mainnet data
      try {
        const mainnetResponse = await fetch(`https://vhs.prod.ripplex.io/v1/network/amendments/vote/main`);
        
        if (!mainnetResponse.ok) {
          throw new Error();
        }

        const mainnetData = await mainnetResponse.json();
        mainnetAmendment = mainnetData.amendments?.find(
          (amendment: any) => amendment.id === amendmentId
        );
      } catch (error) {
        mainnetApiError = true;
      }

      // Fetch GitHub features.macro commit data
      if (devnetAmendment?.name) {
        try {
          const commitsResponse = await fetch(
            `https://api.github.com/repos/XRPLF/rippled/commits?path=include/xrpl/protocol/detail/features.macro&sha=develop&per_page=100`
          );

          if (commitsResponse.ok) {
            const commits = await commitsResponse.json();
            
            // Step 1: Create search terms to filter through commit messages.

            // Exact amendment name as it appears in VHS data
            const exactNamePattern = new RegExp(devnetAmendment.name, 'i');
            
            // Drop "fix" prefix (also used for features.macro matching)
            const amendmentNameNormalized = devnetAmendment.name.replace(/^fix/i, '');
            const normalizedNamePattern = new RegExp(amendmentNameNormalized, 'i');
            
            // Create additional patterns for flexible commit message matching
            const additionalPatterns: RegExp[] = [];
            
            // Extract key terms from CamelCase amendment names
            const keyTerms = devnetAmendment.name
              .replace(/([a-z])([A-Z])/g, '$1 $2') // Split CamelCase
              .split(/\s+/)
              .filter(term => term.length >= 3) // Keep only terms over 3 characters
              .map(term => term.toLowerCase());
            
            // Create patterns for individual key terms (for broader matching)
            keyTerms.forEach(term => {
              if (term.length >= 4) { // Only for longer, more specific terms
                additionalPatterns.push(new RegExp(term, 'i'));
              }
            });
            
            // Create patterns for pairs of key terms (any order)
            for (let i = 0; i < keyTerms.length; i++) {
              for (let j = i + 1; j < keyTerms.length; j++) {
                const term1 = keyTerms[i];
                const term2 = keyTerms[j];
                if (term1.length >= 4 && term2.length >= 4) {
                  // Match both terms in any order with anything in between
                  additionalPatterns.push(new RegExp(`${term1}.*${term2}|${term2}.*${term1}`, 'i'));
                }
              }
            }
            
            // Step 2: Filter commits by those that mention the amendment name or related terms
            let candidateCommits: any[] = [];
            for (const commit of commits) {
              const message = commit.commit.message;
              
              // Check exact name first (as it appears in VHS data)
              if (exactNamePattern.test(message)) {
                candidateCommits.push(commit);
              }
              // Check normalized name (with "fix" prefix removed)
              else if (normalizedNamePattern.test(message)) {
                candidateCommits.push(commit);
              }
              // Check additional patterns if neither exact nor normalized patterns match
              else if (additionalPatterns.some(pattern => pattern.test(message))) {
                candidateCommits.push(commit);
              }
            }
            
            // Step 3: Check each candidate commit for the Supported::yes line
            let detailedCommitAttempts = 0;
            let detailedCommitSuccesses = 0;
            
            for (let i = 0; i < Math.min(candidateCommits.length, 10); i++) {
              const commit = candidateCommits[i];
              
              try {
                detailedCommitAttempts++;
                
                // Add delay to avoid rate limiting
                if (i > 0) {
                  await new Promise(resolve => setTimeout(resolve, 300));
                }
                
                // Get the detailed commit with file changes
                const commitResponse = await fetch(`https://api.github.com/repos/XRPLF/rippled/commits/${commit.sha}`);
                
                if (commitResponse.ok) {
                  detailedCommitSuccesses++;
                  const commitData = await commitResponse.json();
                  
                  // Get the features.macro file changes
                  const featuresFile = commitData.files?.find(
                    (file: any) => file.filename === 'include/xrpl/protocol/detail/features.macro'
                  );
                  
                  if (featuresFile && featuresFile.patch) {
                    const addedLines = featuresFile.patch
                      .split('\n')
                      .filter((line: string) => line.startsWith('+'))
                      .map((line: string) => line.substring(1).trim()); // Remove '+' and trim
                    
                    // Check if any added line matches: ${amendmentName}, Supported::yes
                    const implementationPattern = new RegExp(
                      `${amendmentNameNormalized}[\\s,]*Supported::yes`, 'i'
                    );
                    
                    const matchingLine = addedLines.find(line => 
                      implementationPattern.test(line)
                    );
                    
                    if (matchingLine) {
                      implementationCommit = {
                        sha: commit.sha,
                        commit: {
                          message: commit.commit.message,
                          committer: {
                            date: commit.commit.committer.date,
                            name: commit.commit.committer.name,
                            email: commit.commit.committer.email
                          },
                          author: {
                            name: commit.commit.author.name,
                            email: commit.commit.author.email
                          }
                        },
                        matchedLine: matchingLine
                      };
                      break;
                    }
                  }
                } else {
                  throw new Error();
                }
              } catch (commitError) {
                continue;
              }
            }
            
            // If we had candidate commits but couldn't fetch any detailed commit data, set error
            if (candidateCommits.length > 0 && detailedCommitAttempts > 0 && detailedCommitSuccesses === 0) {
              githubFeatureError = true;
            }
          } else {
            throw new Error();
          }
        } catch (error) {
          githubFeatureError = true;
        }
      }

      // Fetch GitHub version release data
      if (mainnetAmendment?.rippled_version) {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const buildInfoCommitsResponse = await fetch(
            `https://api.github.com/repos/XRPLF/rippled/commits?path=src/libxrpl/protocol/BuildInfo.cpp&sha=master&per_page=100`
          );

          if (buildInfoCommitsResponse.ok) {
            const buildInfoCommits = await buildInfoCommitsResponse.json();
            
            // Extract version number (exclude -rc and -b builds)
            const versionMatch = mainnetAmendment.rippled_version.match(/^(\d+\.\d+\.\d+)(?:-.*)?$/);
            const baseVersion = versionMatch ? versionMatch[1] : mainnetAmendment.rippled_version;
            
            // Create pattern to match "Set version to X.Y.Z" (exact version, no rc/b builds)
            const versionPattern = new RegExp(`Set version to ${baseVersion.replace(/\./g, '\\.')}$`, 'i');
            
            // Search through BuildInfo.cpp commit messages
            for (const commitData of buildInfoCommits) {
              if (versionPattern.test(commitData.commit.message)) {
                versionCommit = {
                  sha: commitData.sha,
                  commit: {
                    committer: {
                      date: commitData.commit.committer.date
                    }
                  }
                };
                break;
              }
            }
          } else {
            throw new Error();
          }
        } catch (error) {
          githubVersionError = true;
        }
      }

      // Update state with collected data
      const finalData = {
        devnetData: devnetAmendment,
        mainnetData: mainnetAmendment,
        featureData: implementationCommit,
        versionData: versionCommit,
        loading: false,
        // Store individual error flags for independent handling
        apiErrors: {
          devnet: devnetApiError,
          mainnet: mainnetApiError,
          githubFeature: githubFeatureError,
          githubVersion: githubVersionError
        }
      };

      setAmendmentData(finalData);
      
      // Call the callbacks to pass data to parent
      if (onDataUpdate) {
        onDataUpdate(finalData);
      }
      
      if (onKeyDatesUpdate) {
        onKeyDatesUpdate(generateKeyDates(finalData));
      }
    };

    if (amendmentId) {
      fetchAmendmentData();
    }
  }, [amendmentId, xlsSpecDate, onDataUpdate, onKeyDatesUpdate]);

  // This component only provides data via callbacks, never renders UI
  return null;
};

export default AmendmentTracker;
