import React from 'react';
import { Helmet } from 'react-helmet-async';

interface JsonLdProps {
  data: object;
}


function isValidJsonLd(data: any): boolean {
  // Basic validation for schema.org context/type
  if (Array.isArray(data)) {
    return data.every(isValidJsonLd);
  }
  if (typeof data !== 'object' || !data) return false;
  if (!data['@context'] || !data['@type']) return false;
  return true;
}

const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  // Support array or single object
  const schemas = Array.isArray(data) ? data : [data];
  const validSchemas = schemas.filter(isValidJsonLd);
  if (!validSchemas.length) return null;
  return (
    <Helmet>
      {validSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default JsonLd;
