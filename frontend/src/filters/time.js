export default value => {
    const date = new Date(value);
    return date.toLocaleString(['en-US'], {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };