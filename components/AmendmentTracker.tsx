import * as React from 'react';

interface AmendmentTrackerProps {
  amendmentId: string;
}

interface AmendmentData {
  vhsData: any;
  loading: boolean;
  error: string | null;
}

export const AmendmentTracker: React.FC<AmendmentTrackerProps> = ({ amendmentId }) => {
  const [amendmentData, setAmendmentData] = React.useState<AmendmentData>({
    vhsData: null,
    loading: true,
    error: null
  });

  React.useEffect(() => {
    const fetchAmendmentData = async () => {
      setAmendmentData(prev => ({ ...prev, loading: true, error: null }));

      try {
        // Validator History Server API call
        const vhsResponse = await fetch(`https://vhs.prod.ripplex.io/v1/network/amendments/vote/main`);

        // Check if response is successful
        if (!vhsResponse.ok) {
          throw new Error(`VHS API error: ${vhsResponse.status}`);
        }

        // Parse JSON response
        const vhsData = await vhsResponse.json();

        // Find specific amendment data
        const specificAmendment = vhsData.amendments?.find(
          (amendment: any) => amendment.id === amendmentId
        );

        setAmendmentData({
          vhsData: specificAmendment || vhsData,
          loading: false,
          error: null
        });

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
            <strong>Implementation Complete:</strong> <span style={{ color: '#666' }}>TBD</span>
          </div>
          <div style={{ marginBottom: '0.5rem', color: 'black' }}>
            <strong>Open for Voting:</strong> <span style={{ color: '#666' }}>
              {amendmentData.vhsData?.rippled_version || 'TBD'}
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
    </div>
  );
};

export default AmendmentTracker;
