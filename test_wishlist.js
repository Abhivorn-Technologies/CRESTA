async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "p1" })
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", data);
  } catch (e) {
    console.error(e);
  }
}
test();
