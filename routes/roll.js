//@flow
'use strict'

import type {$Request, $Response, $NextFunction} from 'express'

export const roll = (req: $Request, res: $Response, next: $NextFunction): void => {
  const {body: {lat, lng}} = req
  res.status(200).send(generateSuggestion(lat, lng))
}
