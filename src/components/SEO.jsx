import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url }) => {
    const siteTitle = "Night Store - Midnight Deals";
    const fullTitle = `${title} | ${siteTitle}`;
    const defaultDesc = "Premium software subscriptions, VPNs, and tech courses at the best prices. Instant delivery via WhatsApp.";
    const siteUrl = "https://night-store.vercel.app"; // Change to your actual domain

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDesc} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || siteUrl} />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || defaultDesc} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url || siteUrl} />
            <meta property="twitter:title" content={title || siteTitle} />
            <meta property="twitter:description" content={description || defaultDesc} />
            {image && <meta property="twitter:image" content={image} />}
        </Helmet>
    );
};

export default SEO;
