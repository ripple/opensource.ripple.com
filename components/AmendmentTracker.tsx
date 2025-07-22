import * as React from 'react';

interface AmendmentTrackerProps {
  amendmentId: string;
  onDataUpdate?: (data: AmendmentData) => void;
}

interface AmendmentData {
  vhsData: any;
  githubData: any;
  versionData: any;
  loading: boolean;
  error: string | null;
}

export const AmendmentTracker: React.FC<AmendmentTrackerProps> = ({ amendmentId, onDataUpdate }) => {
  const [amendmentData, setAmendmentData] = React.useState<AmendmentData>({
    vhsData: null,
    githubData: null,
    versionData: null,
    loading: true,
    error: null
  });

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
        
        // Call the callback to pass data to parent
        if (onDataUpdate) {
          onDataUpdate(finalData);
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

  if (amendmentData.loading) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <p>🔄 Loading amendment data...</p>
      </div>
    );
  }

  if (amendmentData.error) {
    return (
      <div style={{ padding: '1rem', color: 'red' }}>
        <p>❌ Error: {amendmentData.error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Amendment Tracker</h3>
      <p><strong>Amendment ID:</strong> {amendmentId}</p>
      
      {/* Amendment Status Fields */}
      <div style={{ marginTop: '1rem' }}>
        <h4>Amendment Status:</h4>
        <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px' }}>
          <div style={{ marginBottom: '0.5rem', color: 'black' }}>
            <strong>XLS Spec Review:</strong> <span style={{ color: '#666' }}>TBD</span>
          </div>
          <div style={{ marginBottom: '0.5rem', color: 'black' }}>
            <strong>Implementation Complete:</strong> <span style={{ color: '#666' }}>
              {amendmentData.githubData?.commit?.committer?.date ? 
                new Date(amendmentData.githubData.commit.committer.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'TBD'}
            </span>
          </div>
          <div style={{ marginBottom: '0.5rem', color: 'black' }}>
            <strong>Open for Voting:</strong> <span style={{ color: '#666' }}>
              {amendmentData.versionData?.commit?.committer?.date ? 
                `${new Date(amendmentData.versionData.commit.committer.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} (${amendmentData.vhsData?.rippled_version})` :
                (amendmentData.vhsData?.rippled_version || 'TBD')}
            </span>
          </div>
          <div style={{ marginBottom: '0.5rem', color: 'black' }}>
            <strong>Voting Status:</strong> <span style={{ color: '#666' }}>
              {amendmentData.vhsData?.consensus || 
               (amendmentData.vhsData?.date ? `Enabled ${new Date(amendmentData.vhsData.date).toLocaleDateString('en-US', { 
                 year: 'numeric', 
                 month: 'long', 
                 day: 'numeric' 
               })}` : 'TBD')}
            </span>
          </div>
        </div>
      </div>
      
      {amendmentData.vhsData && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Validator History Server Data:</h4>
          <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', color: 'black'}}>
            <pre style={{ fontSize: '0.9em', overflow: 'auto' }}>
              {JSON.stringify(amendmentData.vhsData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {amendmentData.githubData && (
        <div style={{ marginTop: '1rem' }}>
          <h4>GitHub Implementation Data:</h4>
          <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', color: 'black'}}>
            <pre style={{ fontSize: '0.9em', overflow: 'auto' }}>
              {JSON.stringify({
                sha: amendmentData.githubData.sha,
                date: amendmentData.githubData.commit?.committer?.date,
                message: amendmentData.githubData.commit?.message,
                author: amendmentData.githubData.commit?.author?.name,
                matchedLine: amendmentData.githubData.matchedLine
              }, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {amendmentData.versionData && (
        <div style={{ marginTop: '1rem' }}>
          <h4>GitHub Version Data (Open for Voting):</h4>
          <div style={{ background: '#f0f8ff', padding: '1rem', borderRadius: '4px', color: 'black'}}>
            <pre style={{ fontSize: '0.9em', overflow: 'auto' }}>
              {JSON.stringify({
                sha: amendmentData.versionData.sha,
                date: amendmentData.versionData.commit?.committer?.date,
                message: amendmentData.versionData.commit?.message,
                author: amendmentData.versionData.commit?.author?.name,
                matchedVersion: amendmentData.versionData.matchedVersion
              }, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmendmentTracker;
