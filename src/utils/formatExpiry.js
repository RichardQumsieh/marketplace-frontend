const formatExpiry = (expiry) => {
    if (!expiry) return '';
    // Assuming format is "MM/YY" or similar
    return expiry.length === 4 
      ? `${expiry.slice(0, 2)}/${expiry.slice(2)}` 
      : expiry;
  };

export default formatExpiry;