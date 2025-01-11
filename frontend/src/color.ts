export const httpMethodColors: { [key: string]: string } = {
  get: "success.main",  // Green
  post: "primary.main", // Blue
  put: "warning.main",  // Yellow
  patch: "info.main",   // Light Blue
  delete: "error.main", // Red
};
export const getStatusCodeDetails = (statusCode: number) => {
  const statusPrefix = Math.floor(statusCode / 100); // Get the first digit (1xx, 2xx, etc.)

  const statusCodeColors: { [key: number]: { color: string; text: string; description: string } } = {
    1: {
      color: "#BDBDBD",
      text: "Informational",
      description: "Indicates a provisional response. The client should continue the request or ignore the response if the request is already finished."
    },
    2: {
      color: "#4CAF50",
      text: "Success",
      description: "The request was successful, and the server responded with the requested data or result."
    },
    3: {
      color: "#FFC107",
      text: "Redirection",
      description: "Indicates that further action is needed to fulfill the request, such as redirecting to another URI."
    },
    4: {
      color: "#F44336",
      text: "Client Error",
      description: "The client made a bad request or does not have access to the requested resource."
    },
    5: {
      color: "#9C27B0",
      text: "Server Error",
      description: "The server encountered an error and could not fulfill the request."
    },
  };

  const detailedStatusCodeInfo: { [key: number]: string } = {
    100: "Continue: The client should continue the request or ignore the response if the request is already finished.",
    101: "Switching Protocols: The server is switching protocols as requested by the client.",
    102: "Processing (Deprecated): The request has been received, but no status is available.",
    103: "Early Hints: The client can begin preloading resources before the final response is sent.",
    200: "OK: The request succeeded, and the response body contains the result.",
    201: "Created: The request was successful, and a new resource was created as a result.",
    202: "Accepted: The request was received but has not been acted upon yet.",
    203: "Non-Authoritative Information: The response is not the exact data from the origin server.",
    204: "No Content: The request was successful, but there is no content to return.",
    205: "Reset Content: The client should reset the document view.",
    206: "Partial Content: The response is a partial representation of the resource.",
    207: "Multi-Status (WebDAV): Provides status for multiple independent operations.",
    208: "Already Reported (WebDAV): The resource has been reported, avoiding repeated enumeration.",
    226: "IM Used: The response is a result of instance manipulation.",
    300: "Multiple Choices: More than one option is available for the client to choose from.",
    301: "Moved Permanently: The resource has been permanently moved to a new URI.",
    302: "Found: The resource is temporarily available at a different URI.",
    303: "See Other: The client should follow a different URI to access the resource.",
    304: "Not Modified: The resource has not been modified since the last request.",
    305: "Use Proxy (Deprecated): The request must be accessed through a proxy server.",
    307: "Temporary Redirect: The client should repeat the request with the same HTTP method to a new URI.",
    308: "Permanent Redirect: The resource is permanently moved to a new URI, and the same HTTP method must be used.",
    400: "Bad Request: The server cannot process the request due to a client error.",
    401: "Unauthorized: The client must authenticate to access the resource.",
    402: "Payment Required: Reserved for future use, rarely implemented.",
    403: "Forbidden: The client does not have permission to access the resource.",
    404: "Not Found: The resource cannot be found at the given URI.",
    405: "Method Not Allowed: The request method is not supported for the resource.",
    406: "Not Acceptable: The server cannot provide a response that meets the client's criteria.",
    407: "Proxy Authentication Required: The client must authenticate through a proxy server.",
    408: "Request Timeout: The server timed out waiting for the request.",
    409: "Conflict: The request conflicts with the current state of the server.",
    410: "Gone: The resource has been permanently deleted and is no longer available.",
    411: "Length Required: The request must define a Content-Length header.",
    412: "Precondition Failed: A precondition given in the request headers failed.",
    413: "Content Too Large: The request body is larger than the server can process.",
    414: "URI Too Long: The URI requested is too long for the server to process.",
    415: "Unsupported Media Type: The server does not support the media type of the request body.",
    416: "Range Not Satisfiable: The range requested by the client cannot be fulfilled.",
    417: "Expectation Failed: The server could not meet the expectations of the request.",
    418: "I'm a teapot: The server refuses to brew coffee with a teapot.",
    421: "Misdirected Request: The request was sent to a server that cannot respond.",
    422: "Unprocessable Content (WebDAV): The request was valid, but semantic errors prevent it from being followed.",
    423: "Locked (WebDAV): The resource is locked and cannot be accessed.",
    424: "Failed Dependency (WebDAV): The request failed due to a dependency failure.",
    425: "Too Early (Experimental): The server is unwilling to process a request that might be replayed.",
    426: "Upgrade Required: The server requires the client to upgrade to a different protocol.",
    428: "Precondition Required: The request must be conditional to prevent lost updates.",
    429: "Too Many Requests: The client has sent too many requests in a short time.",
    431: "Request Header Fields Too Large: The request headers are too large to process.",
    451: "Unavailable For Legal Reasons: The resource cannot be provided due to legal restrictions.",
    500: "Internal Server Error: The server encountered an unexpected error.",
    501: "Not Implemented: The server does not support the request method.",
    502: "Bad Gateway: The server received an invalid response while acting as a gateway.",
    503: "Service Unavailable: The server is temporarily unable to handle the request.",
    504: "Gateway Timeout: The server did not receive a timely response while acting as a gateway.",
    505: "HTTP Version Not Supported: The server does not support the HTTP version used in the request.",
    506: "Variant Also Negotiates: The server encountered a configuration error during content negotiation.",
    507: "Insufficient Storage (WebDAV): The server is unable to store the representation required for the request.",
    508: "Loop Detected (WebDAV): The server detected an infinite loop while processing the request.",
    510: "Not Extended: The client request requires an unsupported HTTP extension.",
    511: "Network Authentication Required: The client must authenticate to gain network access."
  };

  return {
    ...statusCodeColors[statusPrefix] || { color: "#BDBDBD", text: "Unknown", description: "Unknown status code" },
    description: detailedStatusCodeInfo[statusCode] || "No description available"
  };
};

