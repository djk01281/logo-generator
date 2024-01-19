import { useEffect } from "react";
import { api } from "../../trpc/react";
import { useRouter } from "next/router";
export default function Activate() {
  const router = useRouter();

  const verifyMutation = api.user.verify.useMutation();
  const handleResultAsync = async (token: string) => {
    const result = await verifyMutation.mutateAsync({ token: token });
    if (!result) {
      await router.push({
        pathname: "/",
      });
    } else {
      await router.push({
        pathname: `/register/${result}`,
      });
    }
  };

  type queryResult = {
    token: string;
  };
  useEffect(() => {
    if (!router.isReady) return;
    const { token } = router.query as queryResult;
    void handleResultAsync(token);
  }, [router.isReady]);

  // if (!result) {
  //   await router.push({
  //     pathname: "/",
  //   });
  // }
  return (
    <>
      <div>Validating..</div>
    </>
  );
}
