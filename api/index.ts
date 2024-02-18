import { FrameActionDataParsed } from 'frames.js';
import { parseRequest } from '../modules/utils.js';
import processFrameRequest from '../modules/processFrameRequest.js';

export default async (req) => {
    try {
        const requestURL = new URL(req.url);
        const payload = await parseRequest(req);
        console.log('the request url', requestURL)
        console.log('the payload', payload)
        console.log('does it come here? (before frameMessage)')
        const frameMessage: FrameActionDataParsed = {
            buttonIndex: payload?.untrustedData?.buttonIndex,
            requesterFid: payload?.untrustedData?.fid,
            castId: {
                fid: payload?.untrustedData?.castId?.fid,
                hash: payload?.untrustedData?.castId?.hash,
            },
            inputText: payload?.untrustedData?.inputText,
        };

        console.log('does it come here? (after frameMessage)')

        const frameContext = {
            searchParams: requestURL.searchParams,
            requestURL: payload?.untrustedData.url,
        }

        return await processFrameRequest(frameContext, frameMessage);
    } catch (error) {
        console.error(`Error processing request: ${error}`);
    }
};

export const config = {
    path: "/"
};
