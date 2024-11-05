const TopicInput = ({ topic, setTopic, handleGenerateMindMap, loading }) => (
    <div className="max-w-md mx-auto mb-8">
        <div className="backdrop-blur-sm bg-[#1E1E1E] p-6 rounded-lg shadow-xl">
            <input
                type="text"
                placeholder="Enter a topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#2D2D2D] text-gray-200 px-4 py-3 rounded-md border border-gray-700 focus:outline-none focus:border-purple-500 transition duration-300"
            />
            <button
                onClick={handleGenerateMindMap}
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-md hover:opacity-90 transition duration-300 disabled:opacity-50"
            >
                {loading ? 'Generating...wait for 1-2 mins' : 'Generate Mind Map'}
            </button>
        </div>
    </div>
);

export default TopicInput;
