// components/FlowchartDisplay.jsx
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';

const FlowchartDisplay = ({ mindMapData, edges, flowchartRef }) => (
    <div className="h-[600px] rounded-lg overflow-hidden border border-gray-800" ref={flowchartRef}>
        <ReactFlow
            nodes={mindMapData}
            edges={edges}
            fitView
            style={{
                background: '#1A1A1A',
            }}
        >
            <MiniMap
                style={{
                    background: '#1E1E1E',
                    border: '1px solid #383838',
                }}
            />
            <Controls />
            <Background color="#333" gap={16} />
        </ReactFlow>
    </div>
);

export default FlowchartDisplay;