// Speed Insights initialization for Vercel
// This module injects Vercel Speed Insights to track web performance metrics

import { injectSpeedInsights } from 'https://cdn.jsdelivr.net/npm/@vercel/speed-insights@2/dist/index.mjs';

/**
 * Initialize Vercel Speed Insights
 * Speed Insights will only track data in production (not in development mode)
 */
function initSpeedInsights() {
    try {
        // Inject Speed Insights with default configuration
        // Note: Speed Insights only tracks data in production, not in development
        injectSpeedInsights({
            debug: false, // Set to true to see debug logs
        });
        
        console.log('Vercel Speed Insights initialized');
    } catch (error) {
        console.error('Error initializing Speed Insights:', error);
    }
}

// Initialize on module load
initSpeedInsights();

export default initSpeedInsights;
