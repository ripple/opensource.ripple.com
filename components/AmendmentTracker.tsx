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

  // Helper function to get date feature is available to test on devnet
  const getDevnetDate = (featureData: any, apiErrors: any) => {
    // Check for errors in data sources needed for this date
    if (apiErrors?.devnet) return "API Error";  // Need devnet data for amendment name
    if (apiErrors?.githubFeature) return "API Error";  // Need GitHub feature commits
    
    return featureData?.commit?.committer?.date ? 
      formatDate(featureData.commit.committer.date) : "TBA";
  };

  // Helper function to get date feature is available for voting on Mainnet
  const getMainnetDate = (versionData: any, mainnetData: any, apiErrors: any) => {
    // Check for errors in data sources needed for this date
    if (apiErrors?.mainnet) return "API Error";  // Need mainnet data for version info
    if (apiErrors?.githubVersion) return "API Error";  // Need GitHub version commits
    
    if (!versionData?.commit?.committer?.date) return "TBA";
    
    const dateStr = formatDate(versionData.commit.committer.date);
    const version = mainnetData?.rippled_version ? ` (${mainnetData.rippled_version})` : '';
    return `${dateStr}${version}`;
  };

  // Helper function to get current voting status on Mainnet
  const getVotingStatus = (mainnetData: any, apiErrors: any) => {
    // Check for errors in data sources needed for this status
    if (apiErrors?.mainnet) return "API Error";  // Need mainnet data for voting status
    
    if (!mainnetData) return "TBA";
    
    if (mainnetData.consensus) {
      return mainnetData.consensus;
    }
    
    if (mainnetData.date) {
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
        event: "Voting Status" 
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
          throw new Error(`VHS devnet API error: ${devnetResponse.status}`);
        }

        const devnetData = await devnetResponse.json();
        devnetAmendment = devnetData.amendments?.find(
          (amendment: any) => amendment.id === amendmentId
        );
        
        // Set error if amendment not found in devnet data
        if (!devnetAmendment) {
          devnetApiError = true;
        }
      } catch (error) {
        devnetApiError = true;
      }

      // Fetch VHS mainnet data
      try {
        const mainnetResponse = await fetch(`https://vhs.prod.ripplex.io/v1/network/amendments/vote/main`);
        
        if (!mainnetResponse.ok) {
          throw new Error(`VHS mainnet API error: ${mainnetResponse.status}`);
        }

        const mainnetData = await mainnetResponse.json();
        mainnetAmendment = mainnetData.amendments?.find(
          (amendment: any) => amendment.id === amendmentId
        );
        
        // Set error if amendment not found in mainnet data
        if (!mainnetAmendment) {
          mainnetApiError = true;
        }
      } catch (error) {
        mainnetApiError = true;
      }

      // Fetch GitHub implementation commit data
      if (devnetAmendment?.name) {
        try {
          const commitsResponse = await fetch(
            `https://api.github.com/repos/XRPLF/rippled/commits?path=include/xrpl/protocol/detail/features.macro&sha=develop&per_page=100`
          );

          if (commitsResponse.ok) {
            const commits = await commitsResponse.json();
            
            // Create flexible pattern to match amendment name with variations
            const amendmentNameNormalized = devnetAmendment.name
              .replace(/\s+/g, '[\\s\\-]*')  // Replace spaces with optional spaces or dashes
              .replace(/[^\w\s\-]/g, '');     // Remove special characters except spaces and dashes
            
            const messagePattern = new RegExp(amendmentNameNormalized, 'i');
            
            // Step 2: Filter commits by those that mention the amendment name in commit message
            let candidateCommits: any[] = [];
            for (const commit of commits) {
              if (messagePattern.test(commit.commit.message)) {
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
                    // Look for added lines that match: ${amendmentName}, Supported::yes
                    const addedLines = featuresFile.patch
                      .split('\n')
                      .filter((line: string) => line.startsWith('+'))
                      .map((line: string) => line.substring(1).trim()); // Remove '+' and trim
                    
                    // Check if any added line matches the expected format
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
                  throw new Error(`GitHub commit detail API error: ${commitResponse.status}`);
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
            throw new Error(`GitHub commits API error: ${commitsResponse.status}`);
          }
        } catch (error) {
          githubFeatureError = true;
        }
      }

      // Fetch GitHub version release data
      if (mainnetAmendment?.rippled_version) {
        try {
          await new Promise(resolve => setTimeout(resolve, 400)); // Extra delay
          
          const buildInfoCommitsResponse = await fetch(
            `https://api.github.com/repos/XRPL/rippled/commits?path=src/libxrpl/protocol/BuildInfo.cpp&sha=master&per_page=50`
          );

          if (buildInfoCommitsResponse.ok) {
            const buildInfoCommits = await buildInfoCommitsResponse.json();
            
            // Extract version number (exclude -rc and -b builds)
            const versionMatch = mainnetAmendment.rippled_version.match(/^(\d+\.\d+\.\d+)(?:-.*)?$/);
            const baseVersion = versionMatch ? versionMatch[1] : mainnetAmendment.rippled_version;
            
            // Create pattern to match "Set version to X.Y.Z" (exact version, no rc/b builds)
            const versionPattern = new RegExp(`Set version to ${baseVersion.replace(/\./g, '\\.')}$`, 'i');
            
            // Search through BuildInfo.cpp commit messages
            for (const commit of buildInfoCommits) {
              if (versionPattern.test(commit.commit.message)) {
                versionCommit = {
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
                  matchedVersion: baseVersion
                };
                break;
              }
            }
          } else {
            throw new Error(`GitHub BuildInfo API error: ${buildInfoCommitsResponse.status}`);
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
