import React from "react";

type GenerateBtnProps = {
  clickHandler: (url: string) => void;
};

function GenerateBtn({ clickHandler }: GenerateBtnProps) {
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Provide the full URL, including the base URL for the API route
    const apiUrl = "/api/generate";

    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        try {
          const { url } = (await response.json()) as { url: string };
          clickHandler(url); // Assuming the response contains a 'url' property
        } catch (jsonError) {
          console.error("Error parsing response JSON:", jsonError);
        }
      } else {
        console.error(
          `Fetch error: ${response.status} - ${response.statusText}`,
        );
      }
    } catch (fetchError) {
      console.error("Error fetching data:", fetchError);
    }
  };

  // Assume clickHandler is a function you've defined elsewhere

  return (
    <>
      <button
        className="rounded-md bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={(event) => void handleClick(event)}
      >
        Get Logo
      </button>
    </>
  );
}

export default GenerateBtn;
