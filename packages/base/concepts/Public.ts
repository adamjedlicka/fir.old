import express from 'express'
import { Package } from '@fir/core/src/Package'
import { Concept } from '@fir/core/src/Concept'

export default class Public extends Concept {
  directory() {
    return 'public'
  }

  async beforeAll() {
    this.fir.context.public = []
  }

  async run(pkg: Package) {
    this.fir.context.public.unshift(express.static(pkg.pathResolve('public')))
  }
}
