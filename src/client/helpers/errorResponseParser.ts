export async function parseErrorResponse(response: Response): Promise<string> {
    if (response.headers.get('Content-Type')?.includes('application/json')) {
        return response.json().then((data) => {
            if (data.error) {
                return data.error;
            } else if (data.message) {
                return data.message;
            } else {
                return 'An unknown error occurred.';
            }
        });
    } else if (response.headers.get('Content-Type')?.includes('text/plain')) {
        return response.text();
    }
    return Promise.resolve('An unknown error occurred.');
}
