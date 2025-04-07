declare module 'email-templates' {
  import { Transporter } from 'nodemailer';
  import { Options as JuiceOptions } from 'juice';
  import { Options as EmailOptions } from 'email-templates';

  interface EmailConfig {
    views: {
      root: string;
      options: {
        extension: string;
      };
    };
    message: {
      from: string;
    };
    send: boolean;
    preview: boolean;
    transport: Transporter;
    juice: boolean;
    juiceSettings: {
      tableElements: string[];
    };
    juiceResources: {
      preserveImportant: boolean;
      webResources: {
        relativeTo: string;
      };
    };
  }

  interface EmailMessage {
    to: string;
  }

  interface EmailLocals {
    [key: string]: any;
  }

  interface SendEmailOptions {
    template: string;
    message: EmailMessage;
    locals: EmailLocals;
  }

  class Email {
    constructor(config: EmailConfig);
    send(options: SendEmailOptions): Promise<any>;
  }

  export = Email;
}
