import DOMPurify from 'dompurify';

const SafeHTML = ({ html, className }) => {
  const cleanHTML = DOMPurify.sanitize(html || '', {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'img', 'br', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'style']
  });

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: cleanHTML }} 
    />
  );
};

export default SafeHTML;