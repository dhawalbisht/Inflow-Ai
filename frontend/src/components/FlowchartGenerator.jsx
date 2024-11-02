import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import FlowchartHeader from './FlowchartHeader';
import TopicInput from './TopicInput';
import FlowchartDisplay from './FlowchartDisplay';
import ExportButtons from './ExportButtons';
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
            const flowchartData = response.flowchartData;

            // Set mind map nodes from the response
            setMindMapData(flowchartData);

            // Generate edges to connect all nodes
            const mindMapEdges = flowchartData.map((_, index) => {
                if (index === 0) return null; // Skip the first node
                return {
                    id: `edge-${index}`,
                    source: `node-${index - 1}`, // Connect to the previous node
                    target: `node-${index}`,
                };
            }).filter(edge => edge !== null); // Remove null edges

            setEdges(mindMapEdges);
        } catch (err) {
            setError('Failed to generate mind map. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const exportToImage = async () => {
        if (flowchartRef.current) {
            const canvas = await html2canvas(flowchartRef.current);
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'flowchart.png';
            link.click();
        }
    };

    const exportToPDF = () => {
        const pdf = new jsPDF();
        pdf.text('Mind Map', 10, 10);

        html2canvas(flowchartRef.current).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
            pdf.save('flowchart.pdf');
        });
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
                        <ExportButtons exportToImage={exportToImage} exportToPDF={exportToPDF} />
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
