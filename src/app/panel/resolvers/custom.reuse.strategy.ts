import {RouteReuseStrategy} from '@angular/router/';
import {ActivatedRouteSnapshot, DetachedRouteHandle} from '@angular/router';

// This impl. bases upon one that can be found in the router's test cases.
export class CustomReuseStrategy implements RouteReuseStrategy {

    handlers: {[key: string]: DetachedRouteHandle} = {};

    private keyPath(route: ActivatedRouteSnapshot): string {
        console.log(route.routeConfig.path);
    return route.routeConfig.path + (route.queryParams ? JSON.stringify(route.queryParams) : '');
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return true;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        this.handlers[this.keyPath(route)] = handle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!route.routeConfig && !!this.handlers[this.keyPath(route)];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig) return null;
        return this.handlers[this.keyPath(route)];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {

        let shouldReuse;

        if (future.routeConfig != null && curr.routeConfig != null) {
            shouldReuse = this.keyPath(future) === this.keyPath(curr);
            console.log("REUSE: " + shouldReuse);
            console.log(JSON.stringify(future.queryParams));
        } else {
            shouldReuse = future.routeConfig === curr.routeConfig;
        }

        return shouldReuse;
    }

}