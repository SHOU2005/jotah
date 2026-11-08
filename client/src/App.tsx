import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AgeGate, WhatsAppFloat, ScrollProgress } from "@/components/site-chrome";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/cart";
import Checkout from "@/pages/checkout";
import Admin from "@/pages/admin";
import { GuideArticle, GuidesIndex } from "@/pages/guides";
import Game from "@/pages/game";
import Home from "@/pages/home";
import Product from "@/pages/product";
import WhatTheFun from "@/pages/what-the-fun";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product" component={Product} />
      <Route path="/products"><Redirect to="/product" /></Route>
      <Route path="/testimonials"><Redirect to="/" /></Route>
      <Route path="/what-the-fun" component={WhatTheFun} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/admin" component={Admin} />
      <Route path="/game" component={Game} />
      <Route path="/guides" component={GuidesIndex} />
      <Route path="/guides/:slug" component={GuideArticle} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <ScrollProgress />
        <Toaster />
        <Router />
        <CartDrawer />
        <WhatsAppFloat />
        <AgeGate />
      </CartProvider>
    </QueryClientProvider>
  );
}
