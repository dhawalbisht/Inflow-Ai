export const customNodeStyle = {
    background: '#1E1E1E',
    color: '#E4E4E4',
    border: '1px solid #383838',
    borderRadius: '8px',
    padding: '10px', // Padding for the text
    fontSize: '14px', // Font size
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    maxWidth: '200px', // Increase max width for larger text
    overflow: 'visible', // Allow text overflow to be visible
    whiteSpace: 'normal', // Allow text to wrap
    display: 'flex',
    alignItems: 'flex-start', // Align items to start for better text positioning
    justifyContent: 'center',
};

export const generateMindMapNodes = (flowchartData) => {
    const topics = flowchartData.split('\n').filter(Boolean);
    return topics.map((topic, index) => ({
        id: `node-${index}`,
        data: { label: topic }, // Ensure complete topic is included
        position: { x: Math.random() * 800, y: index * 120 }, // Increase y-spacing for visual separation
        type: 'custom', // Set type to custom
        style: customNodeStyle,
    }));
};

export const generateMindMapEdges = (nodeCount) => {
    const edges = [];
    for (let i = 0; i < nodeCount - 1; i++) {
        edges.push({
            id: `edge-${i}`,
            source: `node-${i}`,
            target: `node-${i + 1}`,
            animated: true,
            style: { stroke: '#383838', strokeWidth: 2 },
        });
    }
    return edges;
};
