const assetBaseUrl = (import.meta.env.VITE_ASSET_BASE_URL || "").replace(/\/$/, "");

const assetUrl = (path) => `${assetBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

export default assetUrl;
