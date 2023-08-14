export const readFileContent = (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const getFileExt = (file_url_or_name: string) => file_url_or_name.split(".").pop();

const fileToBlob = async (file) =>
  new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type });
