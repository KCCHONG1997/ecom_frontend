/**
 * Helper function to get the value of a specific cookie by its name.
 * @param cookieName - The name of the cookie to retrieve.
 * @returns The value of the cookie, or null if not found.
 */
export const getCookie = (cookieName: string): string | null => {
    const cookies = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${cookieName}=`));

    console.log('document: ',document.cookie);
    return cookies ? decodeURIComponent(cookies.split('=')[1]) : null; // Decode cookie value
  };
  