import type { NextApiRequest, NextApiResponse } from 'next'

import AWS from 'aws-sdk'

type Data = {
  name: string
}

function getNamesFromS3(res: NextApiResponse<Data>) {
  AWS.config.update({region: 'eu-north-1'})
  const s3 = new AWS.S3({apiVersion: '2006-03-01'})
  const params = {Bucket: 'testimagestorage007', Key: 'Names.csv'}
  let s3names: any = ""
  s3.getObject(params).
    on('httpData', function(chunk) { s3names += chunk }).
    on('httpDone', function() {
      res.status(200).json(csvtojson(s3names))
    }).
    send()
}

const csvtojson = (data: string, delimiter = ',') => {
  const titles = data.slice(0, data.indexOf('\n')).split(delimiter);
  return data
    .slice(data.indexOf('\n') + 1)
    .split('\n')
    .map(v => {
      const values = v.split(delimiter);
      return titles.reduce(
        (obj: any, title, index) => ((obj[title.replace('\r', '').toLowerCase()] = values[index].replace('\r', '')), obj),
        {}
      );
    });
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  getNamesFromS3(res)
}