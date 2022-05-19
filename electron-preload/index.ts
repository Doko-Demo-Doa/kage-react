import { useLoading } from "./loading";

function domReady(condition: DocumentReadyState[] = ["complete", "interactive"]) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const { appendLoading, removeLoading } = useLoading();

domReady().then(appendLoading);

(window as any).removeLoading = removeLoading;
