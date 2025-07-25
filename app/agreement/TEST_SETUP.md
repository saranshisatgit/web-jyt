# Agreement Page Test Setup

## Static Access Token for Testing

Use this static access token for testing the agreement page:

```
TEST_ACCESS_TOKEN_2024_JYT_AGREEMENT_DEMO_12345
```

## Database Setup Instructions

To test the agreement page, you need to insert test data into your database:

### 1. Create a Test Agreement Response

Insert this data into your `agreement_response` table:

```sql
INSERT INTO agreement_response (
  id,
  status,
  sent_at,
  viewed_at,
  responded_at,
  agreed,
  response_notes,
  email_sent_to,
  email_opened,
  email_opened_at,
  access_token,
  response_ip,
  response_user_agent,
  metadata,
  agreement_id,
  created_at,
  updated_at
) VALUES (
  'test_response_001',
  'sent',
  NOW(),
  NULL,
  NULL,
  NULL,
  NULL,
  'test@example.com',
  false,
  NULL,
  'TEST_ACCESS_TOKEN_2024_JYT_AGREEMENT_DEMO_12345',
  NULL,
  NULL,
  '{}',
  'test_agreement_001',
  NOW(),
  NOW()
);
```

### 2. Create a Test Agreement

Insert this data into your `agreement` table:

```sql
INSERT INTO agreement (
  id,
  title,
  content,
  template_key,
  status,
  valid_from,
  valid_until,
  subject,
  from_email,
  sent_count,
  response_count,
  agreed_count,
  metadata,
  created_at,
  updated_at
) VALUES (
  'test_agreement_001',
  'Test Agreement - Service Terms',
  '<h2>Service Agreement Terms</h2>
  <p>This is a test agreement for demonstrating the agreement review system.</p>
  <h3>Terms and Conditions</h3>
  <ul>
    <li>You agree to use the service responsibly</li>
    <li>You understand this is a test agreement</li>
    <li>You can accept or decline this agreement</li>
  </ul>
  <p><strong>Please review the terms above and provide your response below.</strong></p>',
  'test_template',
  'active',
  NOW(),
  DATE_ADD(NOW(), INTERVAL 30 DAY),
  'Please Review: Test Service Agreement',
  'noreply@jaalyantra.com',
  1,
  0,
  0,
  '{}',
  NOW(),
  NOW()
);
```

## Testing the Agreement Page

After inserting the test data, you can test the agreement page by visiting:

```
http://localhost:3000/agreement/test_response_001?token=TEST_ACCESS_TOKEN_2024_JYT_AGREEMENT_DEMO_12345
```

## Expected Behavior

1. **Loading State**: The page should show a loading spinner initially
2. **Agreement Display**: The agreement content should load and display properly
3. **Response Options**: You should see "Accept Agreement" and "Decline Agreement" buttons
4. **Status Updates**: After responding, the page should update to show your response
5. **Error Handling**: If you use an invalid token, you should see an access denied message

## API Endpoints Used

The page uses these API endpoints:
- `GET /api/web/agreement/{id}?token={access_token}` - Fetch agreement data
- `POST /api/web/agreement/{id}/respond` - Submit agreement response

## Environment Variables

Make sure your jyt-web project has the correct API URL configured:

```env
NEXT_PUBLIC_API_URL=http://localhost:9000
```

## Styling Notes

The agreement page follows the same UI patterns as the map-view component:
- Uses consistent loading states with backdrop blur
- Implements the same animation classes (`animate-fade-in`)
- Follows the same color scheme and spacing patterns
- Uses similar error handling and message display patterns
