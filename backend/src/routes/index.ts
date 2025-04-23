import { Router } from "express";
import UrlRoutes from "../app/modules/url/url.route";

const router = Router();


const ModuleRoutes = [
    {
        path: "/url",
        route: UrlRoutes,
    }
  ];
  
  ModuleRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  export default router;