const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log("fileReader result", reader.result);
      resolve(reader.result);
    };
    reader.onerror = reject;
  });

export default toBase64;

// usage
// async function Main() {
//   const file = document.querySelector('#myfile').files[0];
//   console.log(await toBase64(file));
// }

// Main();
