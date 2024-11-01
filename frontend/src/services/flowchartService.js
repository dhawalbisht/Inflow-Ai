import { endpoints } from '../config/api.js';

export const generateFlowchart = async ({ topic }) => {
    const response = await fetch(endpoints.generateFlowchart, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
        throw new Error('Failed to generate flowchart');
    }

    return response.json();
};
