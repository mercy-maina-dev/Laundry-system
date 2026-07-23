export const emailTemplate = {
    welcome: (firstName: string) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SmartLaundry</title>
        <style>
            body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9fafb; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #1a56db, #1e40af); padding: 40px 30px; text-align: center; }
            .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
            .header p { color: #93c5fd; font-size: 16px; margin: 8px 0 0; }
            .content { padding: 40px 35px; }
            .content h2 { color: #1e293b; font-size: 22px; font-weight: 600; margin: 0 0 16px; }
            .content p { color: #475569; font-size: 16px; line-height: 1.7; margin: 0 0 16px; }
            .content .highlight { color: #1e40af; font-weight: 600; }
            .btn { display: inline-block; background: #1a56db; color: #ffffff !important; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 20px 0 10px; }
            .footer { background: #f8fafc; padding: 24px 35px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer p { color: #94a3b8; font-size: 13px; margin: 4px 0; }
            .footer a { color: #1a56db; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>SmartLaundry</h1>
                <p>Pickup & Delivery System</p>
            </div>
            <div class="content">
                <h2>Welcome, ${firstName}!</h2>
                <p>We are thrilled to have you join the SmartLaundry family. Your account has been successfully created, and you are now ready to experience the most convenient laundry pickup and delivery service.</p>
                <p>With SmartLaundry, you can schedule pickups, track your orders in real time, and enjoy professional laundry care – all from the comfort of your home.</p>
                <p>To get started, simply log in to your account and place your first order. We are here to make your laundry experience seamless and hassle-free.</p>
                <p style="margin-top: 24px;">Welcome aboard,<br><strong>The SmartLaundry Team</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2026 SmartLaundry. All rights reserved.</p>
                <p>Nairobi, Kenya</p>
            </div>
        </div>
    </body>
    </html>
    `,

    verify: (firstName: string, code: string) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9fafb; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #1a56db, #1e40af); padding: 40px 30px; text-align: center; }
            .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
            .header p { color: #93c5fd; font-size: 16px; margin: 8px 0 0; }
            .content { padding: 40px 35px; text-align: center; }
            .content h2 { color: #1e293b; font-size: 22px; font-weight: 600; margin: 0 0 16px; }
            .content p { color: #475569; font-size: 16px; line-height: 1.7; margin: 0 0 16px; }
            .code-box { background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 24px auto; display: inline-block; min-width: 200px; }
            .code-box .code { font-size: 36px; font-weight: 700; color: #1a56db; letter-spacing: 8px; font-family: 'Courier New', monospace; }
            .note { font-size: 14px; color: #94a3b8; margin-top: 20px; }
            .footer { background: #f8fafc; padding: 24px 35px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer p { color: #94a3b8; font-size: 13px; margin: 4px 0; }
            .footer a { color: #1a56db; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>SmartLaundry</h1>
                <p>Pickup & Delivery System</p>
            </div>
            <div class="content">
                <h2>Verify Your Email Address</h2>
                <p>Hello <strong>${firstName}</strong>,</p>
                <p>Thank you for registering with SmartLaundry. To complete your account setup and start using our services, please verify your email address by entering the verification code below.</p>
                <div class="code-box">
                    <div class="code">${code}</div>
                </div>
                <p>This code is valid for a limited time. If you did not request this verification, please ignore this email.</p>
                <p style="margin-top: 24px;">We look forward to serving you,<br><strong>The SmartLaundry Team</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2026 SmartLaundry. All rights reserved.</p>
                <p>Nairobi, Kenya</p>
            </div>
        </div>
    </body>
    </html>
    `,

    verifiedSuccess: (firstName: string) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verified Successfully</title>
        <style>
            body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9fafb; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #059669, #047857); padding: 40px 30px; text-align: center; }
            .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
            .header p { color: #a7f3d0; font-size: 16px; margin: 8px 0 0; }
            .content { padding: 40px 35px; text-align: center; }
            .content h2 { color: #1e293b; font-size: 22px; font-weight: 600; margin: 0 0 16px; }
            .content p { color: #475569; font-size: 16px; line-height: 1.7; margin: 0 0 16px; }
            .success-icon { font-size: 64px; margin: 16px 0; }
            .btn { display: inline-block; background: #059669; color: #ffffff !important; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 20px 0 10px; }
            .footer { background: #f8fafc; padding: 24px 35px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer p { color: #94a3b8; font-size: 13px; margin: 4px 0; }
            .footer a { color: #1a56db; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>SmartLaundry</h1>
                <p>Pickup & Delivery System</p>
            </div>
            <div class="content">
                <div class="success-icon">✓</div>
                <h2>Email Verified Successfully</h2>
                <p>Hello <strong>${firstName}</strong>,</p>
                <p>Your email address has been successfully verified. Your account is now fully active and you can start using all the features of SmartLaundry.</p>
                <p>You can now log in and schedule your first laundry pickup. Our team is ready to provide you with a seamless and convenient laundry experience.</p>
                <p style="margin-top: 24px;">Welcome to the SmartLaundry community,<br><strong>The SmartLaundry Team</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2026 SmartLaundry. All rights reserved.</p>
                <p>Nairobi, Kenya</p>
            </div>
        </div>
    </body>
    </html>
    `
};