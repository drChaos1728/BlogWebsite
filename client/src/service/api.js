// import axios from 'axios';

// import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from '../constants/config';
// import { getAccessToken, getRefreshToken, setAccessToken, getType } from '../utils/common-utils';

// const API_URL = 'http://localhost:8000';

// const axiosInstance = axios.create({
//     baseURL: API_URL,
//     timeout: 10000, 
//     headers: {
//         "content-type": "application/json"
//     }
// });

// axiosInstance.interceptors.request.use(
//     function(config) {
//         if (config.TYPE.params) {
//             config.params = config.TYPE.params
//         } else if (config.TYPE.query) {
//             config.url = config.url + '/' + config.TYPE.query;
//         }
//         return config;
//     },
//     function(error) {
//         return Promise.reject(error);
//     }
// );

// axiosInstance.interceptors.response.use(
//     function(response) {
//         // Stop global loader here
//         return processResponse(response);
//     },
//     function(error) {
//         // Stop global loader here
//         return Promise.reject(ProcessError(error));
//     }
// )

// ///////////////////////////////
// // If success -> returns { isSuccess: true, data: object }
// // If fail -> returns { isFailure: true, status: string, msg: string, code: int }
// //////////////////////////////
// const processResponse = (response) => {
//     if (response?.status === 200) {
//         return { isSuccess: true, data: response.data }
//     } else {
//         return {
//             isFailure: true,
//             status: response?.status,
//             msg: response?.msg,
//             code: response?.code
//         }
//     }
// }

// ///////////////////////////////
// // If success -> returns { isSuccess: true, data: object }
// // If fail -> returns { isError: true, status: string, msg: string, code: int }
// //////////////////////////////
// const ProcessError = async (error) => {
//     if (error.response) {
//         // Request made and server responded with a status code 
//         // that falls out of the range of 2xx
//         if (error.response?.status === 403) {
//             const { url, config } = error.response;
//             console.log(error);
//             try {
//                 let response = await API.getRefreshToken({ token: getRefreshToken() });
//                 if (response.isSuccess) {
//                     sessionStorage.clear();
//                     setAccessToken(response.data.accessToken);

//                     const requestData = error.toJSON();

//                     let response1 = await axios({
//                         method: requestData.config.method,
//                         url: requestData.config.baseURL + requestData.config.url,
//                         headers: { "content-type": "application/json", "authorization": getAccessToken() },
//                         params: requestData.config.params
//                     });
//                 }
//             } catch (error) {
//                 return Promise.reject(error)
//             }
//         } else {
//             console.log("ERROR IN RESPONSE: ", error.toJSON());
//             return {
//                 isError: true,
//                 msg: API_NOTIFICATION_MESSAGES.responseFailure,
//                 code: error.response.status
//             }
//         }
//     } else if (error.request) { 
//         // The request was made but no response was received
//         console.log("ERROR IN RESPONSE: ", error.toJSON());
//         return {
//             isError: true,
//             msg: API_NOTIFICATION_MESSAGES.requestFailure,
//             code: ""
//         }
//     } else { 
//         // Something happened in setting up the request that triggered an Error
//         console.log("ERROR IN RESPONSE: ", error.toJSON());
//         return {
//             isError: true,
//             msg: API_NOTIFICATION_MESSAGES.networkError,
//             code: ""
//         }
//     }
// }

// const API = {};

// for (const [key, value] of Object.entries(SERVICE_URLS)) {
//     API[key] = (body, showUploadProgress, showDownloadProgress) =>
//         axiosInstance({
//             method: value.method,
//             url: value.url,
//             data: value.method === 'DELETE' ? '' : body,
//             responseType: value.responseType,
//             headers: {
//                 authorization: getAccessToken(),
//             },
//             TYPE: getType(value, body),
//             onUploadProgress: function(progressEvent) {
//                 if (showUploadProgress) {
//                     let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                     showUploadProgress(percentCompleted);
//                 }
//             },
//             onDownloadProgress: function(progressEvent) {
//                 if (showDownloadProgress) {
//                     let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                     showDownloadProgress(percentCompleted);
//                 }
//             }
//         });
// }

// export { API };

/*

import axios from 'axios';

import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from '../constants/config';
import { getAccessToken, getRefreshToken, setAccessToken, getType } from '../utils/common-utils';

const API_URL = 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000, 
    headers: {
        "content-type": "application/json"
    }
});

axiosInstance.interceptors.request.use(
    function(config) {
        const type = config.TYPE;
        if (type?.params) {
            config.params = type.params;
        } else if (type?.query) {
            config.url = `${config.url}/${type.query}`;
        }
        config.headers.authorization = getAccessToken();
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function(response) {
        return processResponse(response);
    },
    async function(error) {
        const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                try {
                    const response = await API.getRefreshToken({ token: refreshToken });
                    if (response.isSuccess) {
                        setAccessToken(response.data.accessToken);
                        originalRequest.headers.authorization = getAccessToken();
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(ProcessError(error));
    }
);

const processResponse = (response) => {
    if (response?.status === 200) {
        return { isSuccess: true, data: response.data };
    } else {
        return {
            isFailure: true,
            status: response?.status,
            msg: response?.statusText,
            code: response?.status
        };
    }
};

const ProcessError = (error) => {
    if (error.response) {
        console.error("Error Response:", error.response);
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.responseFailure,
            code: error.response.status
        };
    } else if (error.request) {
        console.error("No Response Received:", error.request);
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.requestFailure,
            code: ""
        };
    } else {
        console.error("Network Error:", error.message);
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.networkError,
            code: ""
        };
    }
};

const API = {};

for (const [key, value] of Object.entries(SERVICE_URLS)) {
    API[key] = (body, showUploadProgress, showDownloadProgress) =>
        axiosInstance({
            method: value.method,
            url: value.url,
            data: value.method === 'DELETE' ? null : body,
            responseType: value.responseType,
            TYPE: getType(value, body),
            onUploadProgress: showUploadProgress
                ? (progressEvent) => {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    showUploadProgress(percentCompleted);
                }
                : undefined,
            onDownloadProgress: showDownloadProgress
                ? (progressEvent) => {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    showDownloadProgress(percentCompleted);
                }
                : undefined
        });
}

export { API };
*/

import axios from 'axios';

import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from '../constants/config';
import { getAccessToken, getRefreshToken, setAccessToken, getType } from '../utils/common-utils';

const API_URL = 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000, 
    headers: {
        "content-type": "application/json"
    }
});

axiosInstance.interceptors.request.use(
    function(config) {
        if (config.TYPE?.params) {
            config.params = config.TYPE.params;
        } else if (config.TYPE?.query) {
            config.url = config.url + '/' + config.TYPE.query;
        }
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function(response) {
        return processResponse(response);
    },
    function(error) {
        return Promise.reject(ProcessError(error));
    }
);

const processResponse = (response) => {
    if (response?.status === 200) {
        return { isSuccess: true, data: response.data };
    } else {
        return {
            isFailure: true,
            status: response?.status,
            msg: response?.msg,
            code: response?.code
        };
    }
};

const ProcessError = async (error) => {
    if (error.response) {
        if (error.response?.status === 403) {
            try {
                let response = await API.getRefreshToken({ token: getRefreshToken() });
                if (response.isSuccess) {
                    setAccessToken(response.data.accessToken);

                    const originalRequest = error.config;
                    originalRequest.headers['authorization'] = getAccessToken();

                    return axiosInstance(originalRequest);
                }
            } catch (err) {
                return Promise.reject(err);
            }
        } else {
            return {
                isError: true,
                msg: API_NOTIFICATION_MESSAGES.responseFailure,
                code: error.response.status
            };
        }
    } else if (error.request) {
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.requestFailure,
            code: ""
        };
    } else {
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.networkError,
            code: ""
        };
    }
};

const API = {};

for (const [key, value] of Object.entries(SERVICE_URLS)) {
    API[key] = (body, showUploadProgress, showDownloadProgress) =>
        axiosInstance({
            method: value.method,
            url: value.url,
            data: value.method === 'DELETE' ? '' : body,
            responseType: value.responseType,
            headers: {
                authorization: getAccessToken(),
                ...(value.method === 'POST' && body instanceof FormData ? { "content-type": "multipart/form-data" } : {})
            },
            TYPE: getType(value, body),
            onUploadProgress: function(progressEvent) {
                if (showUploadProgress) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    showUploadProgress(percentCompleted);
                }
            },
            onDownloadProgress: function(progressEvent) {
                if (showDownloadProgress) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    showDownloadProgress(percentCompleted);
                }
            }
        });
}

export { API };
