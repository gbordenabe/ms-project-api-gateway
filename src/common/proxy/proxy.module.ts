import { Module } from '@nestjs/common';
import { ClientProxyMsProject } from './client-proxy';

@Module({
  providers: [ClientProxyMsProject],
  exports: [ClientProxyMsProject],
})
export class ProxyModule {}
