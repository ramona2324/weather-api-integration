import winston, {Logger as WinstonLogger, format, transports} from 'winston';

// Interface for Logger to ensure type safety anf extensibility
export interface ILogger {
    info(message: string, meta?: Record<string, any>): void;

    warn(message: string, meta?: Record<string, any>): void;

    error(message: string, meta?: Record<string, any>): void;

    debug(message: string, meta?: Record<string, any>): void;
}

// Logger class implementing the ILogger interface
export class Logger implements ILogger {
    private logger: WinstonLogger;
    private context: string;

    constructor(context: string) {
        this.context = context;

        // Configure Winston logger
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info', // Default to 'info' level
            format: format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                format.errors({stack: true}), // Include stack traces for errors
                format.json() // Structured JSON output for better parsing
            ),
            defaultMeta: {service: 'weather-api', context}, // Default metadata
            transports: [
                // Console transport for development
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.printf(({timestamp, level, message, context, ...meta}) => {
                            return `${timestamp} [${level}] [${context}]: ${message} ${
                                Object.keys(meta).length ? JSON.stringify(meta) : ''
                            }`;
                        })
                    ),
                }),
                // File transport for persistent logging
                new transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    format: format.combine(format.json()),
                }),
                new transports.File({
                    filename: 'logs/combined.log',
                    format: format.combine(format.json()),
                }),
            ],
        });

        // Log to console only in development
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.simple()
                    ),
                })
            );
        }
    }

    // Log info level messages
    info(message: string, meta?: Record<string, any>): void {
        this.logger.info(message, {...meta, context: this.context});
    }

    // Log warning level messages
    warn(message: string, meta?: Record<string, any>): void {
        this.logger.warn(message, {...meta, context: this.context});
    }

    // Log error level messages
    error(message: string, meta?: Record<string, any>): void {
        // Handle Error objects specifically to include stack traces
        if (meta && meta instanceof Error) {
            this.logger.error(message, {...meta, stack: meta.stack, context: this.context});
        } else {
            this.logger.error(message, {...meta, context: this.context});
        }
    }

    // Log debug level messages
    debug(message: string, meta?: Record<string, any>): void {
        this.logger.debug(message, {...meta, context: this.context});
    }
}

