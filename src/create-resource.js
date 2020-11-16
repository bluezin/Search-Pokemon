export function createResource(asyncFn) {
  let status = "pending";
  let result;
  const promise = asyncFn().then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") throw promise;
      if (status === "error") throw result;
      if (status === "success") return result;
      throw new Error("This should be impossible");
    },
  };
}
