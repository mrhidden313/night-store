import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url }) => {
    const siteTitle = "VetBook - Premium Veterinary Books";
    const fullTitle = `${title} | ${siteTitle}`;
    const defaultDesc = "Buy premium veterinary books and PDFs. Trusted source for vet students and professionals.";
    const siteUrl = "https://vetbook.store"; // Change to your actual domain

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
