const mockApiDataFetch = () =>
  new Promise<{ status: number; result: any }>((resolve, reject) => {
    setTimeout(() => resolve({ status: 200, result: '' }), 2000);
  });

export default mockApiDataFetch;
