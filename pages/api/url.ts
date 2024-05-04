import type { NextApiRequest, NextApiResponse } from "next";
import { randomID } from "../../lib/crypto";
import clientPromise from "../../lib/mongodb";

type ResponseData = {
    message: string;
    url?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    if (!process.env.MONGODB_COLLECTION_URL)
        throw new Error("Invalid collection name");

    const url_collection = db.collection(process.env.MONGODB_COLLECTION_URL);

    if (req.method === "GET") {
        const id = req.query.id;

        if (!id) {
            return res.status(400).json({ message: "Error: No id provided" });
        }

        return url_collection
            .findOne({ code: id })
            .then((data) => {
                console.log(data);
                if (data == null)
                    return res
                        .status(404)
                        .json({ message: "Error: could not find url" });
                return res
                    .status(200)
                    .json({ message: "URL Found!", url: data.target });
            })
            .catch((err) => {
                return res
                    .status(500)
                    .json({ message: "Error: unexpected db error" });
            });
    }

    if (req.method === "POST") {
        if (!req.body || !req.body.link) {
            return res.status(400).json({ message: "Error: No url provided" });
        }

        const urlPattern =
            /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

        if (!urlPattern.test(req.body.link)) {
            return res
                .status(400)
                .json({ message: "Error: invalid url provided" });
        }

        const id = randomID();
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${id}`;

        return url_collection
            .insertOne({ target: req.body.link, code: id })
            .then((data) => {
                res.status(200).json({
                    message: "URL Shortened successfully",
                    url: url,
                });
            })
            .catch((err) => {
                res.status(409).json({
                    message: "Error: cannot insert in database",
                    url: url,
                });
            });
    }

    return res.status(405).json({ message: "Error: Method not allowed" });
}
