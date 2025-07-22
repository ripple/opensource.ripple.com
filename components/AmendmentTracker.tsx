import * as React from 'react';

interface AmendmentTrackerProps {
  amendmentId: string;
  xlsSpecDate?: string; // Date when XLS spec is live; manually add date in UTC
  onDataUpdate?: (data: AmendmentData) => void;
  onKeyDatesUpdate?: (keyDates: any[]) => void;
}

interface AmendmentData {
  vhsData: any;
  githubData: any;
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
    vhsData: null,
    githubData: null,
    versionData: null,
    loading: true,
    error: null
  });

  // Formatting functions
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    
    // Assume all dates are UTC and convert to user's local timezone
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getVotingStatus = (vhsData: any) => {
    if (!vhsData) return "TBD";
    
    if (vhsData.consensus) {
      return vhsData.consensus;
    }
    
    if (vhsData.date) {
      return `Enabled ${formatDate(vhsData.date)}`;
    }
    
    return "TBD";
  };

  const generateKeyDates = (data: AmendmentData) => {
    return [
      { 
        date: xlsSpecDate ? formatDate(xlsSpecDate) : "TBD", 
        event: "XLS Spec Live" 
      },
      { 
        date: data.githubData?.commit?.committer?.date ? 
          formatDate(data.githubData.commit.committer.date) : "TBD", 
        event: "Available to Test on Devnet" 
      },
      { 
        date: data.versionData?.commit?.committer?.date ? 
          `${formatDate(data.versionData.commit.committer.date)}${data.vhsData?.rippled_version ? ` (${data.vhsData.rippled_version})` : ''}` : "TBD", 
        event: "Open for Voting on Mainnet" 
      },
      { 
        date: getVotingStatus(data.vhsData), 
        event: "Voting Status" 
      },
    ];
  };

  React.useEffect(() => {
    const fetchAmendmentData = async () => {
      setAmendmentData(prev => ({ ...prev, loading: true, error: null }));

      try {
        // First, get VHS data
        const vhsResponse = await fetch(`https://vhs.prod.ripplex.io/v1/network/amendments/vote/main`);
        
        if (!vhsResponse.ok) {
          throw new Error(`VHS API error: ${vhsResponse.status}`);
        }

        const vhsData = await vhsResponse.json();
        const specificAmendment = vhsData.amendments?.find(
          (amendment: any) => amendment.id === amendmentId
        );

        let implementationCommit: any = null;
        let versionCommit: any = null;

        if (specificAmendment?.name) {
          try {
            // Step 1: Get last 100 commits and search commit messages for amendment name
            const commitsResponse = await fetch(
              `https://api.github.com/repos/XRPLF/rippled/commits?sha=develop&per_page=100`
            );

            if (commitsResponse.ok) {
              const commits = await commitsResponse.json();
              
              // Create flexible pattern to match amendment name with variations
              // Convert spaces to optional spaces/dashes, handle case insensitive
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
              
              // Step 2: For each candidate commit, check if it adds the Supported::yes line
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
            }
          } catch (error) {
            console.warn('Error fetching commits:', error);
          }
        }

        // Step 3: Get version release date from BuildInfo.cpp commits if we have a rippled_version
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
            }
          } catch (error) {
            console.warn('Error fetching version commits:', error);
          }
        }

        const finalData = {
          vhsData: specificAmendment || vhsData,
          githubData: implementationCommit,
          versionData: versionCommit,
          loading: false,
          error: null
        };

        setAmendmentData(finalData);
        
        // Call the callbacks to pass data to parent
        if (onDataUpdate) {
          onDataUpdate(finalData);
        }
        
        if (onKeyDatesUpdate) {
          onKeyDatesUpdate(generateKeyDates(finalData));
        }

      } catch (error) {
        console.error('Error fetching amendment data:', error);
        setAmendmentData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }));
      }
    };

    if (amendmentId) {
      fetchAmendmentData();
    }
  }, [amendmentId]);

  // This component only provides data via callbacks, never renders UI
  return null;
};

export default AmendmentTracker;
