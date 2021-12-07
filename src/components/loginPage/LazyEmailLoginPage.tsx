import React from "react";

const EmailLoginPage = React.lazy(() => import('./EmailLoginPage'));

const LazyEmailLoginPage: React.FC<any> = () => (
  <React.Suspense fallback={<div>...Loading...</div>}>
    <EmailLoginPage />
  </React.Suspense>
)

export default LazyEmailLoginPage;
