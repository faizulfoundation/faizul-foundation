# Faizul Foundation Firestore Security Specification

## 1. Data Invariants
1. **Zero Public PII Exposure**: Public visitors (unauthenticated or ordinary authenticated users) can NEVER read, list, update, or delete `/help_requests/{requestId}`.
2. **Intake Integrity**: Public `create` on `/help_requests/{requestId}` MUST enforce `referenceCode == requestId`, `consentAccepted == true`, `status == 'Pending Review'`, `adminNotes == ''`, and `createdAt == request.time && updatedAt == request.time`.
3. **Atomic Non-PII Status Lookup**: `/request_status_lookups/{lookupId}` contains ZERO PII (`requestRef`, `category`, `status`, `createdAt`, `updatedAt`), forbids `list` queries (`allow list: if false`), requires a 64-character lowercase SHA-256 hex digest document ID, and verifies atomic creation via `getAfter()` on `/help_requests/{requestRef}`.
4. **Immutable Applicant Fields**: Admin updates to `/help_requests/{requestId}` can ONLY mutate `status`, `adminNotes`, and `updatedAt`.
5. **Draft Isolation for Activities**: Unpublished activity drafts (`isPublished == false`) are strictly hidden from public `get` and `list` queries; only published activities (`isPublished == true`) are publicly readable.
6. **Verified Admin & Anti-Spoofing**: Bootstrapped admin emails (`faizul8057@gmail.com`, `faizulfoundation@gmail.com`) MUST satisfy `request.auth.token.email_verified == true`. Delegated admins are verified via `/admins/{uid}`, which only bootstrapped admins can write.
7. **Strict Timestamp & Payload Bounds**: Every string and array is strictly size-bounded; every `createdAt` / `updatedAt` equals `request.time`.

## 2. Adversarial "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. **Public Help Request Enumeration**: Unauthenticated `list` on `/help_requests`.
2. **Public Help Request Get**: Unauthenticated or non-admin signed-in `get` on `/help_requests/FF-TEST0001`.
3. **Spoofed Admin Email**: Signed-in user with `email: "faizulfoundation@gmail.com"` and `email_verified: false` attempting to list `/help_requests`.
4. **Forged Initial Status on Intake**: Unauthenticated `create` on `/help_requests/FF-BAD01` with `status: "Verified"`.
5. **Forged Admin Notes on Intake**: Unauthenticated `create` on `/help_requests/FF-BAD02` with `adminNotes: "Approved"`.
6. **Shadow Field Injection on Intake**: Unauthenticated `create` on `/help_requests/FF-BAD03` adding `"isVerified": true`.
7. **Missing Privacy Consent**: Unauthenticated `create` on `/help_requests/FF-BAD04` with `consentAccepted: false`.
8. **Orphan Status Lookup Creation**: Creating `/request_status_lookups/<64-hex>` without atomically creating matching `/help_requests/{requestRef}` with `statusLookupId`.
9. **Status Lookup Enumeration**: Unauthenticated `list` on `/request_status_lookups`.
10. **Applicant PII Tampering by Update**: Admin updating `fullName` or `mobileNumber` in `/help_requests/FF-ADM01`.
11. **Self-Privilege Escalation**: Ordinary signed-in user creating `/admins/{ownUid}` to grant themselves admin privileges.
12. **Unpublished Draft Leak & ID Poisoning**: Unauthenticated `get`/`list` of unpublished activity (`isPublished: false`) or creating a 500-char ID document.
