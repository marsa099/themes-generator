import { ColorTheme } from './types';

interface CodePreviewProps {
  theme: ColorTheme;
  onColorClick: (category: string, name: string, color: string) => void;
  fontFamily?: string;
  language?: 'typescript' | 'csharp';
}

export function CodePreview({
  theme,
  onColorClick,
  fontFamily = '"BerkeleyMono Nerd Font", "Berkeley Mono", monospace',
  language = 'typescript',
}: CodePreviewProps) {
  return (
    <div
      className="p-6 rounded-lg text-sm overflow-x-auto"
      style={{
        backgroundColor: theme.background.primary,
        color: theme.foreground.primary,
        fontFamily,
      }}
    >
      {language === 'typescript' ? (
        <TypeScriptPreview theme={theme} onColorClick={onColorClick} />
      ) : (
        <CSharpPreview theme={theme} onColorClick={onColorClick} />
      )}
    </div>
  );
}

interface PreviewProps {
  theme: ColorTheme;
  onColorClick: (category: string, name: string, color: string) => void;
}

function TypeScriptPreview({ theme, onColorClick }: PreviewProps) {
  return (
    <div className="space-y-1">
      <div>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.comment, fontStyle: "italic" }}
            onClick={() =>
              onColorClick("semantic", "comment", theme.semantic.comment)
            }
          >
            // Calculate the total price of items
          </span>
        </div>

        <div>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "keyword", theme.semantic.keyword)
            }
          >
            function
          </span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.function }}
            onClick={() =>
              onColorClick("semantic", "function", theme.semantic.function)
            }
          >
            calculateTotal
          </span>
          <span style={{ color: theme.foreground.primary }}>(</span>
          <span style={{ color: theme.foreground.primary }}>items</span>
          <span style={{ color: theme.foreground.primary }}>: </span>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.class || theme.semantic.type }}
            onClick={() =>
              onColorClick("semantic", "class", theme.semantic.class || theme.semantic.type)
            }
          >
            Item
          </span>
          <span style={{ color: theme.foreground.primary }}>[]) {"{"}</span>
        </div>

        <div style={{ paddingLeft: "1rem" }}>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "keyword", theme.semantic.keyword)
            }
          >
            let
          </span>{" "}
          <span style={{ color: theme.foreground.primary }}>total</span>
          <span style={{ color: theme.foreground.primary }}>: </span>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "keyword", theme.semantic.keyword)
            }
          >
            number
          </span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.operator }}
            onClick={() =>
              onColorClick("semantic", "operator", theme.semantic.operator)
            }
          >
            =
          </span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.number }}
            onClick={() =>
              onColorClick("semantic", "number", theme.semantic.number)
            }
          >
            0
          </span>
          <span style={{ color: theme.foreground.primary }}>;</span>
        </div>

        <div
          className="cursor-pointer -mx-6 px-6"
          style={{ backgroundColor: theme.background.warningLine, paddingLeft: "calc(1rem + 1.5rem)" }}
          onClick={() => onColorClick("background", "warningLine", theme.background.warningLine)}
        >
          <span
            className="hover:underline"
            style={{ color: theme.semantic.keyword }}
            onClick={(e) => {
              e.stopPropagation();
              onColorClick("semantic", "keyword", theme.semantic.keyword);
            }}
          >
            const
          </span>{" "}
          <span style={{ color: theme.foreground.primary }}>prefix</span>{" "}
          <span
            className="hover:underline"
            style={{ color: theme.semantic.operator }}
            onClick={(e) => {
              e.stopPropagation();
              onColorClick("semantic", "operator", theme.semantic.operator);
            }}
          >
            =
          </span>{" "}
          <span
            className="hover:underline"
            style={{ color: theme.semantic.string }}
            onClick={(e) => {
              e.stopPropagation();
              onColorClick("semantic", "string", theme.semantic.string);
            }}
          >
            "Item: "
          </span>
          <span style={{ color: theme.foreground.primary }}>;</span>
          <span
            className="hover:underline ml-4"
            style={{ color: theme.semantic.comment, fontStyle: "italic" }}
            onClick={(e) => {
              e.stopPropagation();
              onColorClick("semantic", "comment", theme.semantic.comment);
            }}
          >
            // unused variable
          </span>
        </div>

        <div style={{ paddingLeft: "1rem" }}>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.controlFlow || theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "controlFlow", theme.semantic.controlFlow || theme.semantic.keyword)
            }
          >
            for
          </span>{" "}
          <span style={{ color: theme.foreground.primary }}>(</span>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "keyword", theme.semantic.keyword)
            }
          >
            const
          </span>{" "}
          <span style={{ color: theme.foreground.primary }}>item</span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "keyword", theme.semantic.keyword)
            }
          >
            of
          </span>{" "}
          <span style={{ color: theme.foreground.primary }}>items</span>
          <span style={{ color: theme.foreground.primary }}>) {"{"}</span>
        </div>

        <div style={{ paddingLeft: "2rem" }}>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.controlFlow || theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "controlFlow", theme.semantic.controlFlow || theme.semantic.keyword)
            }
          >
            if
          </span>{" "}
          <span style={{ color: theme.foreground.primary }}>(</span>
          <span style={{ color: theme.foreground.primary }}>item</span>
          <span style={{ color: theme.foreground.primary }}>.</span>
          <span style={{ color: theme.foreground.primary }}>isValid</span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.operator }}
            onClick={() =>
              onColorClick("semantic", "operator", theme.semantic.operator)
            }
          >
            &&
          </span>{" "}
          <span style={{ color: theme.foreground.primary }}>item</span>
          <span style={{ color: theme.foreground.primary }}>.</span>
          <span style={{ color: theme.foreground.primary }}>price</span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.operator }}
            onClick={() =>
              onColorClick("semantic", "operator", theme.semantic.operator)
            }
          >
            &gt;
          </span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.number }}
            onClick={() =>
              onColorClick("semantic", "number", theme.semantic.number)
            }
          >
            0
          </span>
          <span style={{ color: theme.foreground.primary }}>) {"{"}</span>
        </div>

        <div style={{ paddingLeft: "3rem" }}>
          <span style={{ color: theme.foreground.primary }}>total</span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.operator }}
            onClick={() =>
              onColorClick("semantic", "operator", theme.semantic.operator)
            }
          >
            +=
          </span>{" "}
          <span style={{ color: theme.foreground.primary }}>item</span>
          <span style={{ color: theme.foreground.primary }}>.</span>
          <span style={{ color: theme.foreground.primary }}>price</span>
          <span style={{ color: theme.foreground.primary }}>;</span>
        </div>

        <div style={{ paddingLeft: "2rem" }}>
          <span style={{ color: theme.foreground.primary }}>{"}"}</span>
        </div>
        <div style={{ paddingLeft: "1rem" }}>
          <span style={{ color: theme.foreground.primary }}>{"}"}</span>
        </div>

        <div style={{ paddingLeft: "1rem" }}>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.controlFlow || theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "controlFlow", theme.semantic.controlFlow || theme.semantic.keyword)
            }
          >
            return
          </span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.variable || theme.foreground.primary }}
            onClick={() =>
              onColorClick("semantic", "variable", theme.semantic.variable || theme.foreground.primary)
            }
          >total</span>
          <span style={{ color: theme.foreground.primary }}>;</span>
        </div>

        <div>
          <span style={{ color: theme.foreground.primary }}>{"}"}</span>
        </div>

        <div
          className="mt-4 pt-4 border-t"
          style={{ borderColor: theme.background.overlay }}
        >
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.comment, fontStyle: "italic" }}
            onClick={() =>
              onColorClick("semantic", "comment", theme.semantic.comment)
            }
          >
            // Additional examples
          </span>
        </div>

        <div>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "keyword", theme.semantic.keyword)
            }
          >
            const
          </span>{" "}
          <span style={{ color: theme.foreground.primary }}>isEnabled</span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.operator }}
            onClick={() =>
              onColorClick("semantic", "operator", theme.semantic.operator)
            }
          >
            =
          </span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.boolean }}
            onClick={() =>
              onColorClick("semantic", "boolean", theme.semantic.boolean)
            }
          >
            true
          </span>
          <span style={{ color: theme.foreground.primary }}>;</span>
        </div>

        <div
          className="cursor-pointer -mx-6 px-6"
          style={{ backgroundColor: theme.background.errorLine }}
          onClick={() => onColorClick("background", "errorLine", theme.background.errorLine)}
        >
          <span
            className="hover:underline"
            style={{ color: theme.semantic.controlFlow || theme.semantic.keyword }}
            onClick={(e) => {
              e.stopPropagation();
              onColorClick("semantic", "controlFlow", theme.semantic.controlFlow || theme.semantic.keyword);
            }}
          >
            throw
          </span>{" "}
          <span
            className="hover:underline"
            style={{ color: theme.semantic.keyword }}
            onClick={(e) => {
              e.stopPropagation();
              onColorClick("semantic", "keyword", theme.semantic.keyword);
            }}
          >
            new
          </span>{" "}
          <span
            className="hover:underline"
            style={{ color: theme.semantic.error }}
            onClick={(e) => {
              e.stopPropagation();
              onColorClick("semantic", "error", theme.semantic.error);
            }}
          >
            Error
          </span>
          <span style={{ color: theme.foreground.primary }}>(</span>
          <span
            className="hover:underline"
            style={{ color: theme.semantic.string }}
            onClick={(e) => {
              e.stopPropagation();
              onColorClick("semantic", "string", theme.semantic.string);
            }}
          >
            "Not implemented"
          </span>
          <span style={{ color: theme.foreground.primary }}>);</span>
        </div>

        <div className="mt-4">
          <span style={{ color: theme.foreground.primary }}>console</span>
          <span style={{ color: theme.foreground.primary }}>.</span>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.method }}
            onClick={() =>
              onColorClick("semantic", "method", theme.semantic.method)
            }
          >
            log
          </span>
          <span style={{ color: theme.foreground.primary }}>(</span>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.string }}
            onClick={() =>
              onColorClick("semantic", "string", theme.semantic.string)
            }
          >
            "Success!"
          </span>
          <span style={{ color: theme.foreground.primary }}>);</span>
        </div>

        <div>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "keyword", theme.semantic.keyword)
            }
          >
            import
          </span>{" "}
          <span style={{ color: theme.foreground.primary }}>{"{"} </span>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.class || theme.semantic.type }}
            onClick={() =>
              onColorClick("semantic", "class", theme.semantic.class || theme.semantic.type)
            }
          >
            Component
          </span>
          <span style={{ color: theme.foreground.primary }}> {"}"}</span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "keyword", theme.semantic.keyword)
            }
          >
            from
          </span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.string }}
            onClick={() =>
              onColorClick("semantic", "string", theme.semantic.string)
            }
          >
            "react"
          </span>
          <span style={{ color: theme.foreground.primary }}>;</span>
        </div>

        <div
          className="mt-4 pt-4 border-t"
          style={{ borderColor: theme.background.overlay }}
        >
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.comment, fontStyle: "italic" }}
            onClick={() =>
              onColorClick("semantic", "comment", theme.semantic.comment)
            }
          >
            // React/JSX Example
          </span>
        </div>

        <div>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "keyword", theme.semantic.keyword)
            }
          >
            function
          </span>{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.function }}
            onClick={() =>
              onColorClick("semantic", "function", theme.semantic.function)
            }
          >
            Button
          </span>
          <span style={{ color: theme.foreground.primary }}>({"{"}</span>
          <span style={{ color: theme.foreground.primary }}>onClick</span>
          <span style={{ color: theme.foreground.primary }}>, </span>
          <span style={{ color: theme.foreground.primary }}>children</span>
          <span style={{ color: theme.foreground.primary }}>{"}"})</span>
          <span style={{ color: theme.foreground.primary }}> {"{"}</span>
        </div>

        <div style={{ paddingLeft: "1rem" }}>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.controlFlow || theme.semantic.keyword }}
            onClick={() =>
              onColorClick("semantic", "controlFlow", theme.semantic.controlFlow || theme.semantic.keyword)
            }
          >
            return
          </span>{" "}
          <span style={{ color: theme.foreground.primary }}>(</span>
        </div>

        <div style={{ paddingLeft: "2rem" }}>
          <span style={{ color: theme.foreground.primary }}>&lt;</span>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.tag || theme.foreground.primary }}
            onClick={() => {
              if (theme.semantic.tag) {
                onColorClick("semantic", "tag", theme.semantic.tag);
              } else {
                onColorClick("foreground", "primary", theme.foreground.primary);
              }
            }}
          >
            button
          </span>
        </div>
        <div style={{ paddingLeft: "3rem" }}>
          <span
            className="cursor-pointer hover:underline"
            style={{
              color: theme.semantic.attribute || theme.foreground.primary,
            }}
            onClick={() => {
              if (theme.semantic.attribute) {
                onColorClick("semantic", "attribute", theme.semantic.attribute);
              } else {
                onColorClick("foreground", "primary", theme.foreground.primary);
              }
            }}
          >
            className
          </span>
          <span style={{ color: theme.foreground.primary }}>=</span>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.string }}
            onClick={() =>
              onColorClick("semantic", "string", theme.semantic.string)
            }
          >
            "px-4 py-2 rounded"
          </span>
        </div>
        <div style={{ paddingLeft: "3rem" }}>
          <span
            className="cursor-pointer hover:underline"
            style={{
              color: theme.semantic.attribute || theme.foreground.primary,
            }}
            onClick={() => {
              if (theme.semantic.attribute) {
                onColorClick("semantic", "attribute", theme.semantic.attribute);
              } else {
                onColorClick("foreground", "primary", theme.foreground.primary);
              }
            }}
          >
            onClick
          </span>
          <span style={{ color: theme.foreground.primary }}>=</span>
          <span style={{ color: theme.foreground.primary }}>
            {"{"}onClick{"}"}
          </span>
        </div>
        <div style={{ paddingLeft: "2rem" }}>
          <span style={{ color: theme.foreground.primary }}>&gt;</span>
        </div>
        <div style={{ paddingLeft: "3rem" }}>
          <span style={{ color: theme.foreground.primary }}>
            {"{"}children{"}"}
          </span>
        </div>
        <div style={{ paddingLeft: "2rem" }}>
          <span style={{ color: theme.foreground.primary }}>&lt;/</span>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.semantic.tag || theme.foreground.primary }}
            onClick={() => {
              if (theme.semantic.tag) {
                onColorClick("semantic", "tag", theme.semantic.tag);
              } else {
                onColorClick("foreground", "primary", theme.foreground.primary);
              }
            }}
          >
            button
          </span>
          <span style={{ color: theme.foreground.primary }}>&gt;</span>
        </div>

        <div style={{ paddingLeft: "1rem" }}>
          <span style={{ color: theme.foreground.primary }}>);</span>
        </div>
        <div>
          <span style={{ color: theme.foreground.primary }}>{"}"}</span>
        </div>
      </div>
  );
}

function CSharpPreview({ theme, onColorClick }: PreviewProps) {
  const kw = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.keyword }}
      onClick={() => onColorClick("semantic", "keyword", theme.semantic.keyword)}
    >
      {text}
    </span>
  );

  // Control flow keywords (return, throw, if, else, etc.)
  const cf = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.controlFlow || theme.semantic.keyword }}
      onClick={() => onColorClick("semantic", "controlFlow", theme.semantic.controlFlow || theme.semantic.keyword)}
    >
      {text}
    </span>
  );

  const ty = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.type }}
      onClick={() => onColorClick("semantic", "type", theme.semantic.type)}
    >
      {text}
    </span>
  );

  const cls = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.class || theme.semantic.type }}
      onClick={() => onColorClick("semantic", "class", theme.semantic.class || theme.semantic.type)}
    >
      {text}
    </span>
  );

  const iface = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.interface || theme.semantic.type }}
      onClick={() => onColorClick("semantic", "interface", theme.semantic.interface || theme.semantic.type)}
    >
      {text}
    </span>
  );

  const str = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.string }}
      onClick={() => onColorClick("semantic", "string", theme.semantic.string)}
    >
      {text}
    </span>
  );

  const attr = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.attribute || theme.foreground.primary }}
      onClick={() => {
        if (theme.semantic.attribute) {
          onColorClick("semantic", "attribute", theme.semantic.attribute);
        } else {
          onColorClick("foreground", "primary", theme.foreground.primary);
        }
      }}
    >
      {text}
    </span>
  );

  const method = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.method }}
      onClick={() => onColorClick("semantic", "method", theme.semantic.method)}
    >
      {text}
    </span>
  );

  const op = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.operator }}
      onClick={() => onColorClick("semantic", "operator", theme.semantic.operator)}
    >
      {text}
    </span>
  );

  const fn = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.function }}
      onClick={() => onColorClick("semantic", "function", theme.semantic.function)}
    >
      {text}
    </span>
  );

  // Variables (local variables, fields)
  const variable = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.variable || theme.foreground.primary }}
      onClick={() => onColorClick("semantic", "variable", theme.semantic.variable || theme.foreground.primary)}
    >
      {text}
    </span>
  );

  // Parameters
  const param = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.parameter || theme.semantic.variable || theme.foreground.primary }}
      onClick={() => onColorClick("semantic", "parameter", theme.semantic.parameter || theme.semantic.variable || theme.foreground.primary)}
    >
      {text}
    </span>
  );

  // Properties/members
  const prop = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.property || theme.foreground.primary }}
      onClick={() => onColorClick("semantic", "property", theme.semantic.property || theme.foreground.primary)}
    >
      {text}
    </span>
  );

  const plain = (text: string) => (
    <span style={{ color: theme.foreground.primary }}>{text}</span>
  );

  const comment = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.comment, fontStyle: "italic" }}
      onClick={() => onColorClick("semantic", "comment", theme.semantic.comment)}
    >
      {text}
    </span>
  );

  const xmlComment = (text: string) => (
    <span
      className="cursor-pointer hover:underline"
      style={{ color: theme.semantic.comment, fontStyle: "italic" }}
      onClick={() => onColorClick("semantic", "comment", theme.semantic.comment)}
    >
      {text}
    </span>
  );

  return (
    <div className="space-y-1">
      {/* Using directives */}
      <div>{kw("using")} {ty("System")}{plain(";")}</div>
      <div>{kw("using")} {ty("System.Linq")}{plain(";")}</div>
      <div>{kw("using")} {ty("Microsoft.AspNetCore.Mvc")}{plain(";")}</div>

      {/* Empty line */}
      <div>&nbsp;</div>

      {/* Namespace */}
      <div>{kw("namespace")} {ty("Api.Controllers")}</div>
      <div>{plain("{")}</div>

      {/* XML doc comment */}
      <div style={{ paddingLeft: "2rem" }}>{xmlComment("/// <summary>")}</div>
      <div style={{ paddingLeft: "2rem" }}>{xmlComment("/// Handles user-related API operations")}</div>
      <div style={{ paddingLeft: "2rem" }}>{xmlComment("/// </summary>")}</div>

      {/* Attributes */}
      <div style={{ paddingLeft: "2rem" }}>{plain("[")}{attr("ApiController")}{plain("]")}</div>
      <div style={{ paddingLeft: "2rem" }}>{plain("[")}{attr("Route")}{plain("(")}{str("\"api/[controller]\"")}{plain(")]")}</div>

      {/* Class declaration with interface */}
      <div style={{ paddingLeft: "2rem" }}>
        {kw("public")} {kw("class")} {cls("UserController")} {plain(":")} {cls("ControllerBase")}{plain(",")} {iface("IUserController")}
      </div>
      <div style={{ paddingLeft: "2rem" }}>{plain("{")}</div>

      {/* Private field */}
      <div style={{ paddingLeft: "4rem" }}>
        {kw("private")} {kw("readonly")} {iface("IUserService")} {variable("_service")}{plain(";")}
      </div>

      {/* Empty line */}
      <div>&nbsp;</div>

      {/* Constructor */}
      <div style={{ paddingLeft: "4rem" }}>
        {kw("public")} {fn("UserController")}{plain("(")}{iface("IUserService")} {param("service")}{plain(")")}
      </div>
      <div style={{ paddingLeft: "4rem" }}>{plain("{")}</div>
      <div style={{ paddingLeft: "6rem" }}>
        {variable("_service")} {op("=")} {param("service")}{plain(";")}
      </div>
      <div style={{ paddingLeft: "4rem" }}>{plain("}")}</div>

      {/* Empty line */}
      <div>&nbsp;</div>

      {/* XML doc for method */}
      <div style={{ paddingLeft: "4rem" }}>{xmlComment("/// <summary>")}</div>
      <div style={{ paddingLeft: "4rem" }}>{xmlComment("/// Gets a user by their unique identifier")}</div>
      <div style={{ paddingLeft: "4rem" }}>{xmlComment("/// </summary>")}</div>

      {/* Method with long route */}
      <div style={{ paddingLeft: "4rem" }}>
        {plain("[")}{attr("HttpGet")}{plain("(")}{str("\"organizations/{orgId}/departments/{deptId}/users/{userId}\"")}{plain(")]")}
      </div>
      <div style={{ paddingLeft: "4rem" }}>
        {kw("public")} {kw("async")} {cls("Task")}{plain("<")}{cls("ActionResult")}{plain("<")}{cls("User")}{plain("?>>")}{" "}
        {fn("GetById")}{plain("(")}{kw("int")} {param("userId")}{plain(")")}
      </div>
      <div style={{ paddingLeft: "4rem" }}>{plain("{")}</div>

      {/* Method body */}
      <div style={{ paddingLeft: "6rem" }}>
        {kw("var")} {variable("user")} {op("=")} {kw("await")} {variable("_service")}{plain(".")}{method("FindAsync")}{plain("(")}{param("userId")}{plain(");")}
      </div>
      <div style={{ paddingLeft: "6rem" }}>
        {cf("if")} {plain("(")}{variable("user")} {kw("is")} {kw("null")}{plain(")")}
      </div>
      <div style={{ paddingLeft: "6rem" }}>{plain("{")}</div>
      <div style={{ paddingLeft: "8rem" }}>
        {cf("return")} {method("NotFound")}{plain("(")}{str("$\"User ")}{plain("{")}{param("userId")}{plain("}")}{str(" was not found\"")}{plain(");")}
      </div>
      <div style={{ paddingLeft: "6rem" }}>{plain("}")}</div>
      <div style={{ paddingLeft: "6rem" }}>
        {cf("return")} {method("Ok")}{plain("(")}{variable("user")}{plain(");")}
      </div>

      <div style={{ paddingLeft: "4rem" }}>{plain("}")}</div>
      <div style={{ paddingLeft: "2rem" }}>{plain("}")}</div>

      {/* Separator */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.background.overlay, paddingLeft: "2rem" }}>
        {comment("// Record type")}
      </div>

      {/* Record */}
      <div style={{ paddingLeft: "2rem" }}>
        {kw("public")} {kw("record")} {cls("User")}{plain("(")}{kw("int")} {prop("Id")}{plain(",")} {kw("string")}{plain("?")} {prop("Name")}{plain(",")} {kw("bool")} {prop("IsActive")}{plain(");")}
      </div>

      {/* Separator */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.background.overlay, paddingLeft: "2rem" }}>
        {comment("// LINQ example")}
      </div>

      {/* LINQ */}
      <div style={{ paddingLeft: "2rem" }}>
        {kw("var")} {variable("activeUsers")} {op("=")} {variable("users")}
      </div>
      <div style={{ paddingLeft: "4rem" }}>
        {plain(".")}{method("Where")}{plain("(")}{param("u")} {op("=>")} {param("u")}{plain(".")}{prop("IsActive")}{plain(")")}
      </div>
      <div style={{ paddingLeft: "4rem" }}>
        {plain(".")}{method("OrderBy")}{plain("(")}{param("u")} {op("=>")} {param("u")}{plain(".")}{prop("Name")}{plain(")")}
      </div>
      <div style={{ paddingLeft: "4rem" }}>
        {plain(".")}{method("ToList")}{plain("();")}
      </div>

      {/* Throw with string interpolation - error line highlight */}
      <div
        className="mt-4 cursor-pointer -mx-6 px-6"
        style={{ backgroundColor: theme.background.errorLine, paddingLeft: "calc(2rem + 1.5rem)" }}
        onClick={() => onColorClick("background", "errorLine", theme.background.errorLine)}
      >
        {cf("throw")} {kw("new")} <span
          className="hover:underline"
          style={{ color: theme.semantic.error }}
          onClick={(e) => {
            e.stopPropagation();
            onColorClick("semantic", "error", theme.semantic.error);
          }}
        >InvalidOperationException</span>{plain("(")}{str("$\"User ")}{plain("{")}{variable("id")}{plain("}")}{str(" not found\"")}{plain(");")}
      </div>

      <div>{plain("}")}</div>
    </div>
  );
}