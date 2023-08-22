const updateData = (type, newData) => {
  switch (type) {
    case "races":
      break;
    default:
      return `Category "${type}" not recognized.`;
      break;
  }

  return `${type} successfully updated.`;
};

export default updateData;
