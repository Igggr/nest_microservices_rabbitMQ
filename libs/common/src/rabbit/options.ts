import { Transport } from "@nestjs/microservices";

export const OPTIONS = {
    transport: Transport.RMQ as const,
    options: {
        // urls: ['amqp://localhost:5672'],
        urls: ['amqp://rabbit:5672'],
        queue: 'auth_queue',
        queueOptions: {
            durable: false,
        },
    },
};