// import { applyDecorators, UseGuards } from "@nestjs/common";
// import { UserRole } from "src/module/auth/user.types";
// import { AuthGuard } from "../guards/auth.guard";
// import { Roles } from "./role.decorator";
// import { ApiBearerAuth } from "@nestjs/swagger";

// export function Auth(...roles: UserRole[]) {
//     return applyDecorators(
//         UseGuards(AuthGuard),
//         Roles(...roles),
//         ApiBearerAuth()
//     );
// }