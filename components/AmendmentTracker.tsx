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
  error: string | null;
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
    error: null
  });

  // Format date from UTC to local date
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    
    // Use the user's browser locale for date formatting
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getVotingStatus = (mainnetData: any) => {
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
        date: data.featureData?.commit?.committer?.date ? 
          formatDate(data.featureData.commit.committer.date) : "TBA", 
        event: "Available to Test on Devnet" 
      },
      { 
        date: data.versionData?.commit?.committer?.date ? 
          `${formatDate(data.versionData.commit.committer.date)}${data.devnetData?.rippled_version ? ` (${data.devnetData.rippled_version})` : ''}` : "TBA", 
        event: "Open for Voting on Mainnet" 
      },
      { 
        date: getVotingStatus(data.mainnetData), 
        event: "Voting Status" 
      },
    ];
  };

  React.useEffect(() => {
    const fetchAmendmentData = async () => {
      setAmendmentData(prev => ({ ...prev, loading: true, error: null }));

      // Initialize data containers
      let specificAmendment: any = null;
      let mainnetAmendment: any = null;
      let implementationCommit: any = null;
      let versionCommit: any = null;
      let hasAnyError = false;
      let errorMessages: string[] = [];

      // Fetch VHS devnet data
      try {
        const devnetResponse = await fetch(`https://vhs.prod.ripplex.io/v1/network/amendments/vote/dev`);
        
        if (!devnetResponse.ok) {
          throw new Error(`VHS devnet API error: ${devnetResponse.status}`);
        }

        const devnetData = await devnetResponse.json();
        specificAmendment = devnetData.amendments?.find(
          (amendment: any) => amendment.id === amendmentId
        );
      } catch (error) {
        console.warn('Error fetching devnet VHS data:', error);
        errorMessages.push('Failed to fetch devnet data');
        hasAnyError = true;
      }

      // Fetch VHS mainnet data
      try {
        const mainnetResponse = await fetch(`https://vhs.prod.ripplex.io/v1/network/amendments/vote/main`);
        if (mainnetResponse.ok) {
          const mainnetData = await mainnetResponse.json();
          mainnetAmendment = mainnetData.amendments?.find(
            (amendment: any) => amendment.id === amendmentId
          );
        } else {
          throw new Error(`VHS mainnet API error: ${mainnetResponse.status}`);
        }
      } catch (error) {
        console.warn('Error fetching mainnet VHS data:', error);
        errorMessages.push('Failed to fetch mainnet data');
        hasAnyError = true;
      }

      // Fetch GitHub implementation commit data
      if (specificAmendment?.name) {
        try {
          const commitsResponse = await fetch(
            `https://api.github.com/repos/XRPLF/rippled/commits?sha=develop&per_page=100`
          );

          if (commitsResponse.ok) {
            const commits = await commitsResponse.json();
            
            // Create flexible pattern to match amendment name with variations
            const amendmentNameNormalized = specificAmendment.name
              .replace(/\s+/g, '[\\s\\-]*')  // Replace spaces with optional spaces or dashes
              .replace(/[^\w\s\-]/g, '');     // Remove special characters except spaces and dashes
            
            const messagePattern = new RegExp(amendmentNameNormalized, 'i');
            
            // Search through commit messages
            let candidateCommits: any[] = [];
            for (const commit of commits) {
              if (messagePattern.test(commit.commit.message)) {
                candidateCommits.push(commit);
              }
            }
            
            // Check each candidate commit for the Supported::yes line
            for (let i = 0; i < Math.min(candidateCommits.length, 5); i++) {
              const commit = candidateCommits[i];
              
              try {
                // Add delay to avoid rate limiting
                if (i > 0) {
                  await new Promise(resolve => setTimeout(resolve, 300));
                }
                
                // Get the detailed commit with file changes
                const commitResponse = await fetch(`https://api.github.com/repos/XRPLF/rippled/commits/${commit.sha}`);
                
                if (commitResponse.ok) {
                  const commitData = await commitResponse.json();
                  
                  // Check if this commit modified the features.macro file
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
                }
              } catch (commitError) {
                console.warn(`Error checking commit ${commit.sha}:`, commitError);
                continue;
              }
            }
          } else {
            throw new Error(`GitHub commits API error: ${commitsResponse.status}`);
          }
        } catch (error) {
          console.warn('Error fetching GitHub implementation commits:', error);
          errorMessages.push('Failed to fetch implementation data');
          hasAnyError = true;
        }
      }

      // Fetch GitHub version release data
      if (specificAmendment?.rippled_version) {
        try {
          await new Promise(resolve => setTimeout(resolve, 400)); // Extra delay
          
          const buildInfoCommitsResponse = await fetch(
            `https://api.github.com/repos/XRPLF/rippled/commits?path=src/libxrpl/protocol/BuildInfo.cpp&sha=master&per_page=50`
          );

          if (buildInfoCommitsResponse.ok) {
            const buildInfoCommits = await buildInfoCommitsResponse.json();
            
            // Extract version number (exclude -rc and -b builds)
            const versionMatch = specificAmendment.rippled_version.match(/^(\d+\.\d+\.\d+)(?:-.*)?$/);
            const baseVersion = versionMatch ? versionMatch[1] : specificAmendment.rippled_version;
            
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
          console.warn('Error fetching GitHub version commits:', error);
          errorMessages.push('Failed to fetch version data');
          hasAnyError = true;
        }
      }

      // Update state with collected data
      const finalData = {
        devnetData: specificAmendment,
        mainnetData: mainnetAmendment,
        featureData: implementationCommit,
        versionData: versionCommit,
        loading: false,
        error: hasAnyError ? errorMessages.join(', ') : null
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
