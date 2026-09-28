/**
 * Thin compatibility layer so the existing Skypay pages keep their familiar
 * navigation API while the app runs on TanStack Router.
 */
import {
  Link as TanstackLink,
  Outlet,
  useLocation as useTanstackLocation,
  useNavigate as useTanstackNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import type { AnchorHTMLAttributes, ReactElement, ReactNode } from "react";

export { Outlet };

const AnyLink = TanstackLink as unknown as (props: Record<string, unknown>) => ReactElement;

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  replace?: boolean;
  state?: unknown;
  children?: ReactNode;
};

export function Link({ to, replace, state, ...rest }: LinkProps) {
  return <AnyLink to={to} replace={replace} state={state ?? {}} {...rest} />;
}

type NavLinkProps = Omit<LinkProps, "className" | "children"> & {
  end?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  children?: ReactNode | ((props: { isActive: boolean }) => ReactNode);
};

export function NavLink({ to, end, className, children, ...rest }: NavLinkProps) {
  const { pathname } = useTanstackLocation();
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  return (
    <AnyLink
      to={to}
      className={typeof className === "function" ? className({ isActive }) : className}
      {...rest}
    >
      {typeof children === "function" ? children({ isActive }) : children}
    </AnyLink>
  );
}

export type NavigateOptions = { replace?: boolean; state?: unknown };

export function useNavigate() {
  const navigate = useTanstackNavigate();
  const router = useRouter();
  return (to: string | number, options?: NavigateOptions) => {
    if (typeof to === "number") {
      router.history.go(to);
      return;
    }
    void navigate({
      to,
      replace: options?.replace,
      state: (options?.state ?? {}) as never,
    });
  };
}

export function useLocation() {
  const location = useTanstackLocation();
  return {
    pathname: location.pathname,
    search: location.searchStr ?? "",
    hash: location.hash,
    state: location.state as unknown,
  };
}

export function Navigate({
  to,
  replace = true,
  state,
}: {
  to: string;
  replace?: boolean;
  state?: unknown;
}) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace, state });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);
  return null;
}
