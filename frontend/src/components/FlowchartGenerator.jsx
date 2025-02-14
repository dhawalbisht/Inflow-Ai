import React, { useState, useRef } from 'react';
import FlowchartHeader from './FlowchartHeader';
import TopicInput from './TopicInput';
import FlowchartDisplay from './FlowchartDisplay';
import { generateFlowchart } from '../services/flowchartService';

const FlowchartGenerator = () => {
    const [topic, setTopic] = useState('');
    const [mindMapData, setMindMapData] = useState([]);
    const [edges, setEdges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const flowchartRef = useRef();

    const handleGenerateMindMap = async () => {
        setLoading(true);
        setError('');
        setMindMapData([]); // Reset mindMapData
        setEdges([]); // Reset edges

        try {
            const response = await generateFlowchart({ topic });
            const { flowchartData, edges: generatedEdges } = response;

            // Set mind map nodes and edges from the response
            setMindMapData(flowchartData);
            setEdges(generatedEdges);
        } catch (err) {
            setError('Failed to generate mind map. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-gray-200">
            <div className="container mx-auto px-4 py-8">
                <FlowchartHeader />
                <TopicInput
                    topic={topic}
                    setTopic={setTopic}
                    handleGenerateMindMap={handleGenerateMindMap}
                    loading={loading}
                />

                {error && (
                    <div className="text-red-400 text-center mb-4">
                        {error}
                    </div>
                )}

                {mindMapData.length > 0 && (
                    <div className="mt-8" ref={flowchartRef}>
                        <FlowchartDisplay mindMapData={mindMapData} edges={edges} />
                    </div>
                )}

                {mindMapData.length === 0 && !loading && (
                    <div className="text-gray-400 text-center mt-4">
                        Please enter a topic to generate a mind map.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlowchartGenerator;
