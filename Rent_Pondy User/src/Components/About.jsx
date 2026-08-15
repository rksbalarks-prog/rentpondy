





/**
 * About Component
 * Displays different content sections (About Us, Terms, Privacy Policy, FAQ)
 * Fetches content from the backend API and renders it with loading/error states
 */

import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * About - Main component for displaying information pages
 * Features:
 * - Dynamic content selection via dropdown
 * - Async data fetching with loading state
 * - Error handling and user feedback
 * - Responsive Bootstrap layout
 */
const About = () => {
    // State for selected content type (aboutUs, termsConditions, privacyPolicy, faq)
    const [type, setType] = useState("aboutUs");
    
    // State for fetched content HTML
    const [content, setContent] = useState("");
    
    // State for loading indicator during API call
    const [loading, setLoading] = useState(false);
    
    // State for error messages
    const [error, setError] = useState("");

    /**
     * Available content types with display labels
     * Maps API content types to user-friendly labels for dropdown
     */
    const contentTypes = [
        { value: "aboutUs", label: "About Us" },
        { value: "termsConditions", label: "Terms & Conditions" },
        { value: "privacyPolicy", label: "Privacy Policy" },
        { value: "faq", label: "FAQ" },
    ];

    /**
     * useEffect Hook - Fetches content whenever 'type' changes
     * Lifecycle:
     * 1. Set loading to true
     * 2. Clear previous errors
     * 3. Make API request to fetch content
     * 4. Update content state or set error
     * 5. Set loading to false
     */
    useEffect(() => {
        const fetchContent = async () => {
            // Show loading indicator
            setLoading(true);
            // Clear previous errors
            setError("");
            try {
                // Fetch content from backend using selected type
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/get-text/${type}`
                );
                // Set content from response, default to empty string if undefined
                setContent(response.data?.content || "");
            } catch (error) {
                // Handle API errors
                setError("Failed to load content");
                setContent("");
            } finally {
                // Hide loading indicator
                setLoading(false);
            }
        };

        // Execute fetch function
        fetchContent();
    }, [type]); // Re-run when type changes

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12">
                    {/* Page Title */}
                    <h1 className="mb-4">Information</h1>

                    {/* Dropdown to select content type */}
                    <div className="mb-4">
                        <label className="form-label fw-bold">Select Section:</label>
                        {/* Dropdown selector - triggers type change and content fetch */}
                        <select
                            className="form-select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            {/* Map content types to dropdown options */}
                            {contentTypes.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Loading Indicator - Shows while fetching data */}
                    {loading && <div className="alert alert-info">Loading...</div>}

                    {/* Error Alert - Shows if API request fails */}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {/* Content Display Area - Shows fetched HTML content */}
                    {!loading && content && (
                        <div className="content-box p-4 border rounded">
                            {/* Render HTML content using dangerouslySetInnerHTML */}
                            {/* WARNING: Only use with trusted server content */}
                            <p dangerouslySetInnerHTML={{ __html: content }}></p>
                        </div>
                    )}

                    {/* Empty State - Shows when no content is available */}
                    {!loading && !content && !error && (
                        <div className="alert alert-warning">No content available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Export component for use in other parts of the application
export default About;
