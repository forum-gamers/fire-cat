import { type GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { readdirSync } from 'fs';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['user'],
    protoPath: (() => {
      const result: string[] = [];
      for (const dirr of readdirSync(join(__dirname, '../proto')))
        result.push(join(__dirname, `../proto/${dirr}`));
      return result;
    })(),
    url: process.env.APPLICATION_URL ?? 'localhost:50050',
  },
};
