const handlePayment = async () => {
  setIsSaving(true);
  setIsRedirectingToPayment(true);

  try {
    // 1️⃣ Salva a página (sem ativar)
    const giftPage = await saveGiftPage();
    if (!giftPage) return;

    setSavedSlug(giftPage.slug);
    setSavedGiftPageId(giftPage.id);

    // 2️⃣ Chama a Edge Function DIRETO (SEM supabase.invoke)
    const response = await fetch(
      "https://fiyokldgrzedxyxpgomf.supabase.co/functions/v1/create-checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giftPageId: giftPage.id,
          slug: giftPage.slug,
          email: user?.email,
        }),
      }
    );

    const data = await response.json();

    // 3️⃣ Tratamento de erro
    if (!response.ok) {
      throw new Error(data?.error || "Failed to create checkout");
    }

    // 4️⃣ Redireciona para o Stripe
    if (data?.url) {
      window.location.href = data.url;
    } else {
      throw new Error("No checkout URL returned");
    }

  } catch (error) {
    console.error("Checkout error:", error);

    toast({
      title: "Error",
      description: "No se pudo iniciar el pago. Intenta de nuevo.",
      variant: "destructive",
    });

  } finally {
    setIsSaving(false);
    setIsRedirectingToPayment(false);
  }
};
